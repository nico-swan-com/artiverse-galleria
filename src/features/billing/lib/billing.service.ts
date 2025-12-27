/**
 * Billing Service
 *
 * Core billing logic for order creation and payment processing.
 * Uses the PaymentProvider abstraction to handle payments.
 * Orders are persisted to the database.
 */

import { PaymentProvider } from './payment-provider.interface'
import { PayFastProvider } from './payfast.provider'
import { ordersRepository } from './orders.repository'
import {
  Order,
  OrderItem,
  CreateOrderInput,
  PaymentRequest,
  PaymentResponse,
  OrderStatus
} from '../types/billing.types'
import { NewOrder, NewOrderItem } from '@/lib/database/schema'
import { logger } from '@/lib/utilities/logger'
import { notificationService } from '@/features/notifications'

export class BillingService {
  private paymentProvider: PaymentProvider

  constructor(provider?: PaymentProvider) {
    // Default to PayFast mock provider
    this.paymentProvider = provider || new PayFastProvider()
  }

  /**
   * Create a new order from cart items
   */
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const orderId = this.generateOrderId()

    // Calculate totals
    const subtotal = input.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const shipping = 0 // Free shipping for now
    const tax = 0 // Tax calculation would go here
    const total = subtotal + shipping + tax

    // Build database order record
    const orderData: NewOrder = {
      id: orderId,
      userId: input.userId, // Link to authenticated user
      customerFirstName: input.customer.firstName,
      customerLastName: input.customer.lastName,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      shippingAddress: input.customer.address,
      shippingCity: input.customer.city,
      shippingState: input.customer.state,
      shippingZip: input.customer.zip,
      shippingCountry: input.customer.country,
      subtotal: String(subtotal),
      shipping: String(shipping),
      tax: String(tax),
      total: String(total),
      status: 'pending',
      notes: input.notes
    }

    // Build order items for database
    const orderItemsData: Omit<NewOrderItem, 'orderId'>[] = input.items.map(
      (item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.totalPrice),
        productTitle: item.product.title,
        productSku: item.product.sku
      })
    )

    // Store order in database
    const dbOrder = await ordersRepository.create(orderData, orderItemsData)

    logger.info('Order created', {
      orderId,
      total,
      itemCount: input.items.length
    })

    // Return order in the format expected by the rest of the application
    const order = this.mapDbOrderToOrder(dbOrder, input.items)

    // Send order confirmation email (non-blocking)
    notificationService.sendOrderConfirmation(order).catch((err) => {
      logger.error('Failed to send order confirmation email', err)
    })

    return order
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order | null> {
    const result = await ordersRepository.findByIdWithItems(orderId)

    if (!result) return null

    // Map database order back to application Order type
    const order: Order = {
      id: result.order.id,
      customerId: result.order.userId || undefined,
      customer: {
        firstName: result.order.customerFirstName,
        lastName: result.order.customerLastName,
        email: result.order.customerEmail,
        phone: result.order.customerPhone || undefined,
        address: result.order.shippingAddress,
        city: result.order.shippingCity,
        state: result.order.shippingState,
        zip: result.order.shippingZip,
        country: result.order.shippingCountry
      },
      items: result.items.map((item) => ({
        productId: item.productId,
        product: {
          id: item.productId,
          title: item.productTitle,
          sku: item.productSku || 0,
          price: parseFloat(item.unitPrice)
        } as OrderItem['product'],
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice)
      })),
      subtotal: parseFloat(result.order.subtotal),
      shipping: parseFloat(result.order.shipping),
      tax: parseFloat(result.order.tax),
      total: parseFloat(result.order.total),
      status: result.order.status as OrderStatus,
      paymentMethod: result.order.paymentMethod || undefined,
      paymentId: result.order.paymentId || undefined,
      notes: result.order.notes || undefined,
      createdAt: result.order.createdAt,
      updatedAt: result.order.updatedAt
    }

    return order
  }

  /**
   * Get paginated orders for admin
   */
  async getAdminOrders(
    page: number,
    limit: number,
    status?: string
  ): Promise<{ orders: Order[]; total: number }> {
    const { orders, total } = await ordersRepository.getPaged(
      page,
      limit,
      status
    )

    // Map DB orders to Order type
    // Note: We don't fetch items for the list view to improve performance
    const mappedOrders = orders.map((dbOrder) =>
      this.mapDbOrderToOrder(dbOrder, [])
    )

    return {
      orders: mappedOrders,
      total
    }
  }

  /**
   * Initiate payment for an order
   */
  async initiatePayment(
    orderId: string,
    baseUrl: string
  ): Promise<PaymentResponse> {
    const order = await this.getOrder(orderId)

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // Build payment request
    const paymentRequest: PaymentRequest = {
      orderId: order.id,
      amount: order.total,
      currency: 'ZAR', // South African Rand for PayFast
      description: `Artiverse Galleria Order #${order.id}`,
      customer: {
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
        phone: order.customer.phone
      },
      returnUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
      notifyUrl: `${baseUrl}/api/billing/webhook`,
      metadata: {
        source: 'artiverse-galleria',
        itemCount: String(order.items.length)
      }
    }

    // Update order status
    await this.updateOrderStatus(orderId, 'processing')

    // Initiate payment with provider
    const response = await this.paymentProvider.initiatePayment(paymentRequest)

    if (response.success && response.paymentId) {
      // Store payment reference
      await ordersRepository.updatePayment(
        orderId,
        response.paymentId,
        this.paymentProvider.name
      )
    }

    return response
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(
    orderId: string,
    paymentId: string
  ): Promise<Order | null> {
    const order = await this.getOrder(orderId)

    if (!order) {
      logger.error('Order not found for payment success', {
        orderId,
        paymentId
      })
      return null
    }

    // Verify payment with provider
    const verification = await this.paymentProvider.verifyPayment(
      paymentId,
      orderId
    )

    if (verification.success && verification.status === 'complete') {
      await this.updateOrderStatus(
        orderId,
        'paid',
        'payment_completed',
        `Payment completed successfully - R${order.total.toLocaleString()}`
      )
      logger.info('Payment completed successfully', { orderId, paymentId })

      // Send payment confirmation email (non-blocking)
      notificationService.sendPaymentConfirmation(order).catch((err) => {
        logger.error('Failed to send payment confirmation email', err)
      })
    } else {
      logger.warn('Payment verification failed', {
        orderId,
        paymentId,
        status: verification.status
      })
    }

    return this.getOrder(orderId)
  }

  /**
   * Handle payment cancellation
   */
  async handlePaymentCancellation(orderId: string): Promise<Order | null> {
    await this.updateOrderStatus(orderId, 'cancelled')
    logger.info('Payment cancelled', { orderId })
    return this.getOrder(orderId)
  }

  /**
   * Process webhook notification
   */
  async processWebhook(payload: unknown, signature?: string): Promise<boolean> {
    try {
      // Validate signature if provided
      if (
        signature &&
        !this.paymentProvider.validateWebhookSignature(payload, signature)
      ) {
        logger.error('Invalid webhook signature')
        return false
      }

      // Process webhook
      const webhookData = await this.paymentProvider.processWebhook(payload)

      // Update order based on webhook status
      const statusMap: Record<string, OrderStatus> = {
        complete: 'paid',
        pending: 'processing',
        failed: 'cancelled',
        cancelled: 'cancelled'
      }

      const newStatus = statusMap[webhookData.status] || 'processing'
      await this.updateOrderStatus(webhookData.orderId, newStatus)

      logger.info('Webhook processed', {
        orderId: webhookData.orderId,
        paymentId: webhookData.paymentId,
        status: webhookData.status
      })

      return true
    } catch (error) {
      logger.error('Webhook processing failed', error as Error)
      return false
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    eventType?: string,
    description?: string
  ): Promise<void> {
    await ordersRepository.updateStatus(orderId, status, eventType, description)
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `ORD-${timestamp}-${random}`.toUpperCase()
  }

  /**
   * Map database order to application Order type
   */
  private mapDbOrderToOrder(
    dbOrder: { id: string; [key: string]: unknown },
    items: OrderItem[]
  ): Order {
    return {
      id: dbOrder.id,
      customer: {
        firstName: dbOrder.customerFirstName as string,
        lastName: dbOrder.customerLastName as string,
        email: dbOrder.customerEmail as string,
        phone: dbOrder.customerPhone as string | undefined,
        address: dbOrder.shippingAddress as string,
        city: dbOrder.shippingCity as string,
        state: dbOrder.shippingState as string,
        zip: dbOrder.shippingZip as string,
        country: dbOrder.shippingCountry as string
      },
      items,
      subtotal: parseFloat(dbOrder.subtotal as string),
      shipping: parseFloat(dbOrder.shipping as string),
      tax: parseFloat(dbOrder.tax as string),
      total: parseFloat(dbOrder.total as string),
      status: dbOrder.status as OrderStatus,
      paymentMethod: dbOrder.paymentMethod as string | undefined,
      paymentId: dbOrder.paymentId as string | undefined,
      notes: dbOrder.notes as string | undefined,
      createdAt: dbOrder.createdAt as Date,
      updatedAt: dbOrder.updatedAt as Date
    }
  }
}

// Export singleton instance
export const billingService = new BillingService()
