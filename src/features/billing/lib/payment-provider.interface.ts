/**
 * Payment Provider Interface
 *
 * Abstract interface that all payment providers must implement.
 * This allows swapping payment providers (PayFast, Stripe, etc.)
 * without changing the billing service logic.
 */

import {
  PaymentRequest,
  PaymentResponse,
  PaymentVerificationResult,
  WebhookPayload
} from '../types/billing.types'

export abstract class PaymentProvider {
  /**
   * Provider name identifier
   */
  abstract readonly name: string

  /**
   * Whether the provider is in test/sandbox mode
   */
  abstract readonly isTestMode: boolean

  /**
   * Initiate a payment
   * @param request - Payment request details
   * @returns Payment response with redirect URL or error
   */
  abstract initiatePayment(request: PaymentRequest): Promise<PaymentResponse>

  /**
   * Verify a payment after completion
   * @param paymentId - External payment ID
   * @param orderId - Internal order ID
   * @returns Verification result with status
   */
  abstract verifyPayment(
    paymentId: string,
    orderId: string
  ): Promise<PaymentVerificationResult>

  /**
   * Process webhook/ITN notification from provider
   * @param payload - Raw webhook payload
   * @returns Parsed and validated webhook data
   */
  abstract processWebhook(payload: unknown): Promise<WebhookPayload>

  /**
   * Validate webhook signature
   * @param payload - Webhook payload
   * @param signature - Signature from provider
   * @returns Whether signature is valid
   */
  abstract validateWebhookSignature(
    payload: unknown,
    signature: string
  ): boolean

  /**
   * Request a refund
   * @param paymentId - External payment ID
   * @param amount - Amount to refund (optional, full refund if not specified)
   * @returns Success status
   */
  abstract refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ success: boolean; error?: string }>
}
