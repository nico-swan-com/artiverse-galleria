/**
 * PayFast Payment Provider (Mock Implementation)
 *
 * Mock implementation of the PayFast payment gateway.
 * This follows the PayFast API structure for future real integration.
 *
 * @see https://developers.payfast.co.za/docs
 */

import { PaymentProvider } from './payment-provider.interface'
import {
  PaymentRequest,
  PaymentResponse,
  PaymentVerificationResult,
  WebhookPayload
} from '../types/billing.types'
import { logger } from '@/lib/utilities/logger'

// PayFast configuration interface
interface PayFastConfig {
  merchantId: string
  merchantKey: string
  passPhrase?: string
  testMode: boolean
}

// PayFast specific payment data structure
interface PayFastPaymentData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last?: string
  email_address: string
  cell_number?: string
  m_payment_id: string // Our order ID
  amount: string
  item_name: string
  item_description?: string
  custom_str1?: string
  custom_str2?: string
  signature?: string
}

export class PayFastProvider extends PaymentProvider {
  readonly name = 'payfast'
  readonly isTestMode: boolean

  private config: PayFastConfig
  private baseUrl: string

  constructor(config?: Partial<PayFastConfig>) {
    super()

    // Default to test mode with sandbox credentials
    this.config = {
      merchantId:
        config?.merchantId || process.env.PAYFAST_MERCHANT_ID || '10000100',
      merchantKey:
        config?.merchantKey ||
        process.env.PAYFAST_MERCHANT_KEY ||
        '46f0cd694581a',
      passPhrase: config?.passPhrase || process.env.PAYFAST_PASSPHRASE || '',
      testMode: config?.testMode ?? process.env.PAYFAST_TEST_MODE !== 'false'
    }

    this.isTestMode = this.config.testMode
    this.baseUrl = this.isTestMode
      ? 'https://sandbox.payfast.co.za'
      : 'https://www.payfast.co.za'

    logger.info(`PayFast provider initialized`, {
      testMode: this.isTestMode,
      merchantId: this.config.merchantId
    })
  }

  /**
   * Initiate a PayFast payment
   * In production, this generates form data for redirect.
   * In mock mode, simulates the process.
   */
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    logger.info('Initiating PayFast payment', {
      orderId: request.orderId,
      amount: request.amount
    })

    try {
      // Build PayFast payment data
      const paymentData: PayFastPaymentData = {
        merchant_id: this.config.merchantId,
        merchant_key: this.config.merchantKey,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        notify_url: request.notifyUrl,
        name_first: request.customer.name.split(' ')[0],
        name_last:
          request.customer.name.split(' ').slice(1).join(' ') || undefined,
        email_address: request.customer.email,
        cell_number: request.customer.phone,
        m_payment_id: request.orderId,
        amount: request.amount.toFixed(2),
        item_name: request.description.substring(0, 100),
        item_description: request.description.substring(0, 255),
        custom_str1: request.metadata?.source || 'artiverse-galleria'
      }

      // Generate signature
      paymentData.signature = this.generateSignature(
        paymentData as unknown as Record<string, unknown>
      )

      // In mock mode, simulate successful payment initiation
      if (this.isTestMode) {
        const mockPaymentId = `pf_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`

        logger.info('Mock PayFast payment initiated', {
          paymentId: mockPaymentId,
          orderId: request.orderId
        })

        return {
          success: true,
          paymentId: mockPaymentId,
          // In real implementation, this would be PayFast's hosted page
          // For mock, redirect to a confirmation page
          redirectUrl: `/checkout/confirm?orderId=${request.orderId}&paymentId=${mockPaymentId}&mock=true`
        }
      }

      // Real implementation would POST to PayFast or return form data
      // For now, return the redirect URL
      const queryParams = new URLSearchParams()
      Object.entries(paymentData).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })

      return {
        success: true,
        paymentId: request.orderId,
        redirectUrl: `${this.baseUrl}/eng/process?${queryParams.toString()}`
      }
    } catch (error) {
      logger.error('PayFast payment initiation failed', error as Error)
      return {
        success: false,
        error: 'Failed to initiate payment'
      }
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(
    paymentId: string,
    orderId: string
  ): Promise<PaymentVerificationResult> {
    logger.info('Verifying PayFast payment', { paymentId, orderId })

    // In mock mode, always return success
    if (this.isTestMode && paymentId.startsWith('pf_mock_')) {
      return {
        success: true,
        status: 'complete',
        paymentId,
        orderId,
        amount: 0 // Would be fetched from order in real implementation
      }
    }

    // Real implementation would call PayFast API to verify
    // For now, simulate pending
    return {
      success: false,
      status: 'pending',
      paymentId,
      orderId,
      amount: 0,
      error: 'Payment verification not implemented for production'
    }
  }

  /**
   * Process PayFast ITN (Instant Transaction Notification)
   */
  async processWebhook(payload: unknown): Promise<WebhookPayload> {
    const data = payload as Record<string, string>

    logger.info('Processing PayFast ITN', {
      paymentId: data.pf_payment_id,
      orderId: data.m_payment_id
    })

    // Map PayFast status to our status
    const statusMap: Record<string, string> = {
      COMPLETE: 'complete',
      FAILED: 'failed',
      PENDING: 'pending',
      CANCELLED: 'cancelled'
    }

    return {
      paymentId: data.pf_payment_id || '',
      orderId: data.m_payment_id || '',
      status: statusMap[data.payment_status] || 'pending',
      amount: parseFloat(data.amount_gross) || 0,
      signature: data.signature,
      rawPayload: payload
    }
  }

  /**
   * Validate PayFast ITN signature
   */
  validateWebhookSignature(payload: unknown, signature: string): boolean {
    // In mock mode, always valid
    if (this.isTestMode) return true

    // Real implementation would validate the MD5 signature
    // using the PayFast algorithm
    const data = payload as Record<string, string>
    const expectedSignature = this.generateSignature(data)
    return signature === expectedSignature
  }

  /**
   * Refund payment (not fully supported by PayFast API)
   */
  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ success: boolean; error?: string }> {
    logger.warn('PayFast refund attempted - manual process required', {
      paymentId,
      amount
    })

    // PayFast doesn't have a direct refund API
    // Refunds must be processed manually through the dashboard
    return {
      success: false,
      error:
        'PayFast refunds must be processed manually through the merchant dashboard'
    }
  }

  /**
   * Generate MD5 signature for PayFast
   */
  private generateSignature(data: Record<string, unknown>): string {
    // Remove signature from data if present
    const { signature: _signature, ...dataWithoutSig } = data

    // Build parameter string
    const params = Object.entries(dataWithoutSig)
      .filter(([, value]) => value !== undefined && value !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&')

    // Add passphrase if configured
    const stringToHash = this.config.passPhrase
      ? `${params}&passphrase=${encodeURIComponent(this.config.passPhrase)}`
      : params

    // In real implementation, use crypto.createHash('md5')
    // For now, return a mock signature
    if (this.isTestMode) {
      return (
        'mock_signature_' +
        Buffer.from(stringToHash).toString('base64').substring(0, 16)
      )
    }

    // Real MD5 hash would be generated here
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto')
    return crypto.createHash('md5').update(stringToHash).digest('hex')
  }
}
