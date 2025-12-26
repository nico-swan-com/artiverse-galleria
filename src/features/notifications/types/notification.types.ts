/**
 * Notification Types
 *
 * Type definitions for the notifications feature.
 */

import { Order, OrderItem } from '@/features/billing/types'

/**
 * Order notification data for email templates
 */
export interface OrderNotificationData {
  orderId: string
  customerName: string
  customerEmail: string
  items: {
    title: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  orderDate: Date
}

/**
 * Email notification options
 */
export interface EmailNotificationOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Notification result
 */
export interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Convert Order to OrderNotificationData
 */
export function orderToNotificationData(order: Order): OrderNotificationData {
  return {
    orderId: order.id,
    customerName: `${order.customer.firstName} ${order.customer.lastName}`,
    customerEmail: order.customer.email,
    items: order.items.map((item: OrderItem) => ({
      title: item.product.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    shippingAddress: {
      address: order.customer.address,
      city: order.customer.city,
      state: order.customer.state,
      zip: order.customer.zip,
      country: order.customer.country
    },
    orderDate: order.createdAt
  }
}
