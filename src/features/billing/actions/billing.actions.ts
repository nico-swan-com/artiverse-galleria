'use server'

/**
 * Billing Server Actions
 *
 * Server actions for order creation and payment processing.
 */

import { billingService } from '../lib/billing.service'
import {
  CreateOrderInput,
  CustomerInfo,
  OrderItem
} from '../types/billing.types'
import { Product } from '@/types/products/product.schema'
import { logger } from '@/lib/utilities/logger'
import { headers } from 'next/headers'
import { auth } from '@/features/authentication/lib/next-auth'

/**
 * Convert cart items to order items
 */
function cartToOrderItems(
  cartItems: { artwork: Product; quantity: number }[]
): OrderItem[] {
  return cartItems.map((item) => ({
    productId: item.artwork.id,
    product: item.artwork,
    quantity: item.quantity,
    unitPrice: item.artwork.price,
    totalPrice: item.artwork.price * item.quantity
  }))
}

/**
 * Create order and initiate payment
 */
export async function createOrderAndPay(
  customerData: CustomerInfo,
  cartItems: { artwork: Product; quantity: number }[],
  notes?: string
) {
  try {
    // Validate input
    if (!cartItems || cartItems.length === 0) {
      return {
        success: false,
        error: 'Cart is empty'
      }
    }

    // Get the current user session
    const session = await auth()
    const userId = session?.user?.id

    // Convert cart items to order items
    const orderItems = cartToOrderItems(cartItems)

    // Create order input
    const orderInput: CreateOrderInput = {
      customer: customerData,
      items: orderItems,
      notes,
      userId
    }

    // Create order
    const order = await billingService.createOrder(orderInput)

    // Get base URL from request headers
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    const baseUrl = `${protocol}://${host}`

    // Initiate payment
    const paymentResponse = await billingService.initiatePayment(
      order.id,
      baseUrl
    )

    if (!paymentResponse.success) {
      return {
        success: false,
        error: paymentResponse.error || 'Payment initiation failed'
      }
    }

    logger.info('Order created and payment initiated', {
      orderId: order.id,
      paymentId: paymentResponse.paymentId
    })

    return {
      success: true,
      orderId: order.id,
      paymentId: paymentResponse.paymentId,
      redirectUrl: paymentResponse.redirectUrl
    }
  } catch (error) {
    logger.error('Failed to create order and initiate payment', error as Error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string) {
  try {
    const order = await billingService.getOrder(orderId)

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    return {
      success: true,
      order
    }
  } catch (error) {
    logger.error('Failed to get order', error as Error)
    return {
      success: false,
      error: 'Failed to retrieve order'
    }
  }
}

/**
 * Confirm mock payment (for testing)
 */
export async function confirmMockPayment(orderId: string, paymentId: string) {
  try {
    const order = await billingService.handlePaymentSuccess(orderId, paymentId)

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    return {
      success: true,
      order
    }
  } catch (error) {
    logger.error('Failed to confirm payment', error as Error)
    return {
      success: false,
      error: 'Payment confirmation failed'
    }
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string) {
  try {
    const order = await billingService.handlePaymentCancellation(orderId)

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    return {
      success: true,
      order
    }
  } catch (error) {
    logger.error('Failed to cancel order', error as Error)
    return {
      success: false,
      error: 'Order cancellation failed'
    }
  }
}

/**
 * Get paginated orders for admin dashboard
 */
export async function getAdminOrdersAction(
  page: number = 1,
  limit: number = 10,
  status?: string
) {
  try {
    // Check for admin role (optional: verify user role here if not handled by middleware)
    const session = await auth()
    if (session?.user?.role !== 'Admin') {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const { orders, total } = await billingService.getAdminOrders(
      page,
      limit,
      status
    )

    return {
      success: true,
      orders,
      total
    }
  } catch (error) {
    logger.error('Failed to get admin orders', error as Error)
    return {
      success: false,
      error: 'Failed to retrieve orders'
    }
  }
}
