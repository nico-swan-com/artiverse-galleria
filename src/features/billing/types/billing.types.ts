/**
 * Billing Types
 *
 * Type definitions for orders, payments, and billing operations.
 */

import {
  Order,
  OrderItem,
  CreateOrderInput,
  OrderStatus,
  CustomerInfo
} from '@/features/orders/types/order.types'

export type { Order, OrderItem, CreateOrderInput, OrderStatus, CustomerInfo }

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
