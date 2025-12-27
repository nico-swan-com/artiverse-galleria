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
      const { GET } = await import('./route')

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ status: 'Webhook endpoint active' })
    })
  })

  describe('POST /api/billing/webhook', () => {
    it('should process webhook successfully', async () => {
      const { POST } = await import('./route')

      // Mock FormData parsing
      const mockPayload = {
        pf_payment_id: 'payment-123',
        m_payment_id: 'order-456',
        payment_status: 'COMPLETE',
        signature: 'test-signature'
      }

      ;(billingService.processWebhook as jest.Mock).mockResolvedValue(true)

      // Create a mock FormData object
      const mockFormData = new FormData()
      Object.entries(mockPayload).forEach(([key, value]) => {
        mockFormData.append(key, value)
      })

      // Create a mock request with formData method
      const request = {
        formData: jest.fn().mockResolvedValue(mockFormData)
      } as unknown as NextRequest

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(billingService.processWebhook).toHaveBeenCalledWith(
        expect.objectContaining(mockPayload),
        'test-signature'
      )
    })

    it('should handle webhook processing failure', async () => {
      const { POST } = await import('./route')

      const mockPayload = {
        pf_payment_id: 'payment-123',
        m_payment_id: 'order-456',
        payment_status: 'FAILED',
        signature: 'test-signature'
      }

      ;(billingService.processWebhook as jest.Mock).mockResolvedValue(false)

      // Create a mock FormData object
      const mockFormData = new FormData()
      Object.entries(mockPayload).forEach(([key, value]) => {
        mockFormData.append(key, value)
      })

      const request = {
        formData: jest.fn().mockResolvedValue(mockFormData)
      } as unknown as NextRequest

      const response = await POST(request)
      const text = await response.text()

      expect(response.status).toBe(400)
      expect(text).toBe('Webhook processing failed')
    })

    it('should handle errors', async () => {
      const { POST } = await import('./route')

      const mockPayload = {
        pf_payment_id: 'payment-123'
      }

      const error = new Error('Processing error')
      ;(billingService.processWebhook as jest.Mock).mockRejectedValue(error)

      // Create a mock FormData object
      const mockFormData = new FormData()
      Object.entries(mockPayload).forEach(([key, value]) => {
        mockFormData.append(key, value)
      })

      const request = {
        formData: jest.fn().mockResolvedValue(mockFormData)
      } as unknown as NextRequest

      const response = await POST(request)
      const text = await response.text()

      expect(response.status).toBe(500)
      expect(text).toBe('Internal server error')
    })
  })
})
