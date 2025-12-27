import { POST, GET } from './route'
import { billingService } from '@/features/billing/lib/billing.service'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/features/billing/lib/billing.service', () => ({
  billingService: {
    processWebhook: jest.fn()
  }
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}))

jest.mock('@/lib/security', () => ({
  withRateLimit: jest.fn((_config, handler) => handler),
  RATE_LIMIT_CONFIG: {
    WEBHOOK: { limit: 200, window: 60000 }
  }
}))

describe('Billing Webhook API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/billing/webhook', () => {
    it('should return webhook status', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ status: 'Webhook endpoint active' })
    })
  })

  describe('POST /api/billing/webhook', () => {
    it('should process webhook successfully', async () => {
      const formData = new FormData()
      formData.append('pf_payment_id', 'payment-123')
      formData.append('m_payment_id', 'order-456')
      formData.append('payment_status', 'COMPLETE')
      formData.append('signature', 'test-signature')
      ;(billingService.processWebhook as jest.Mock).mockResolvedValue(true)

      const request = new NextRequest('http://localhost/api/billing/webhook', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(billingService.processWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          pf_payment_id: 'payment-123',
          m_payment_id: 'order-456',
          payment_status: 'COMPLETE',
          signature: 'test-signature'
        }),
        'test-signature'
      )
    })

    it('should handle webhook processing failure', async () => {
      const formData = new FormData()
      formData.append('pf_payment_id', 'payment-123')
      formData.append('m_payment_id', 'order-456')
      formData.append('payment_status', 'FAILED')
      formData.append('signature', 'test-signature')
      ;(billingService.processWebhook as jest.Mock).mockResolvedValue(false)

      const request = new NextRequest('http://localhost/api/billing/webhook', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const text = await response.text()

      expect(response.status).toBe(400)
      expect(text).toBe('Webhook processing failed')
    })

    it('should handle errors', async () => {
      const formData = new FormData()
      formData.append('pf_payment_id', 'payment-123')

      const error = new Error('Processing error')
      ;(billingService.processWebhook as jest.Mock).mockRejectedValue(error)

      const request = new NextRequest('http://localhost/api/billing/webhook', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const text = await response.text()

      expect(response.status).toBe(500)
      expect(text).toBe('Internal server error')
    })
  })
})
