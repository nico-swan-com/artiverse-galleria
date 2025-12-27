import {
  trackPageView,
  trackArtworkView,
  trackCartAdd,
  trackCheckoutStart,
  trackCheckoutComplete,
  trackUserLogin,
  trackUserRegister,
  trackSearch,
  getAnalyticsDashboard
} from './analytics.actions'
import { analyticsService } from '../lib'
import { auth } from '@/features/authentication/lib/next-auth'

// Mock dependencies
jest.mock('../lib', () => ({
  analyticsService: {
    trackEvent: jest.fn(),
    getDashboardMetrics: jest.fn()
  }
}))

jest.mock('@/features/authentication/lib/next-auth', () => ({
  auth: jest.fn()
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'test-session-id' }))
  }))
}))

describe('Analytics Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackPageView', () => {
    it('should track page view', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })

      await trackPageView('/test')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'page_view',
        userId: 'user-1',
        sessionId: expect.any(String),
        path: '/test'
      })
    })
  })

  describe('trackArtworkView', () => {
    it('should track artwork view', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })

      await trackArtworkView('artwork-1', 'Test Artwork')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'artwork_view',
        userId: 'user-1',
        sessionId: expect.any(String),
        path: '/artworks/artwork-1',
        metadata: { title: 'Test Artwork' }
      })
    })
  })

  describe('trackCartAdd', () => {
    it('should track cart add', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })

      await trackCartAdd('product-1', 'Test Product')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'cart_add',
        userId: 'user-1',
        sessionId: expect.any(String),
        metadata: { productId: 'product-1', title: 'Test Product' }
      })
    })
  })

  describe('trackCheckoutStart', () => {
    it('should track checkout start', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })

      await trackCheckoutStart()

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'checkout_start',
        userId: 'user-1',
        sessionId: expect.any(String),
        path: '/checkout'
      })
    })
  })

  describe('trackCheckoutComplete', () => {
    it('should track checkout complete', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })

      await trackCheckoutComplete('order-1')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'checkout_complete',
        userId: 'user-1',
        sessionId: expect.any(String),
        path: '/checkout/success',
        metadata: { orderId: 'order-1' }
      })
    })
  })

  describe('trackUserLogin', () => {
    it('should track user login', async () => {
      await trackUserLogin('user-1')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'user_login',
        userId: 'user-1',
        sessionId: expect.any(String),
        path: '/login'
      })
    })
  })

  describe('trackUserRegister', () => {
    it('should track user registration', async () => {
      await trackUserRegister('user-1')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'user_register',
        userId: 'user-1',
        sessionId: expect.any(String),
        path: '/register'
      })
    })
  })

  describe('trackSearch', () => {
    it('should track search', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })

      await trackSearch('test query')

      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        eventType: 'search',
        userId: 'user-1',
        sessionId: expect.any(String),
        metadata: { query: 'test query' }
      })
    })
  })

  describe('getAnalyticsDashboard', () => {
    it('should return dashboard metrics for authenticated user', async () => {
      const mockMetrics = {
        totalPageViews: 100,
        totalArtworkViews: 50,
        totalCartAdds: 20,
        totalCheckouts: 10
      }
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })
      ;(analyticsService.getDashboardMetrics as jest.Mock).mockResolvedValue(
        mockMetrics
      )

      const result = await getAnalyticsDashboard()

      expect(result.success).toBe(true)
      expect(result.metrics).toEqual(mockMetrics)
    })

    it('should return error for unauthenticated user', async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)

      const result = await getAnalyticsDashboard()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authenticated')
    })

    it('should handle errors', async () => {
      ;(auth as jest.Mock).mockResolvedValue({
        user: { id: 'user-1' }
      })
      ;(analyticsService.getDashboardMetrics as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const result = await getAnalyticsDashboard()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to get analytics')
    })
  })
})
