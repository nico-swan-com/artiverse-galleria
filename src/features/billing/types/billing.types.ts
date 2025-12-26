/**
 * Billing Types
 *
 * Type definitions for orders, payments, and billing operations.
 */

import { Product } from '@/types/products/product.schema'

// Order status enum
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

// Order item (cart item with calculated totals)
export interface OrderItem {
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Customer information for order
export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

// Order type
export interface Order {
  id: string
  customerId?: string // Optional - for guest checkout
  customer: CustomerInfo
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod?: string
  paymentId?: string // External payment provider reference
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Create order input
export interface CreateOrderInput {
  customer: CustomerInfo
  items: OrderItem[]
  notes?: string
  userId?: string // Optional - for authenticated users
}

// Payment request sent to payment provider
export interface PaymentRequest {
  orderId: string
  amount: number
  currency: string
  description: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  returnUrl: string
  cancelUrl: string
  notifyUrl: string // Webhook URL for payment notifications
  metadata?: Record<string, string>
}

// Payment response from provider
export interface PaymentResponse {
  success: boolean
  paymentId?: string
  redirectUrl?: string // URL to redirect user for payment
  error?: string
  rawResponse?: unknown
}

// Payment verification result
export interface PaymentVerificationResult {
  success: boolean
  status: 'complete' | 'pending' | 'failed' | 'cancelled'
  paymentId: string
  orderId: string
  amount: number
  error?: string
}

// Webhook payload (generic, each provider extends this)
export interface WebhookPayload {
  paymentId: string
  orderId: string
  status: string
  amount: number
  signature?: string
  rawPayload: unknown
}
