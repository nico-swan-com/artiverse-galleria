'use server'

/**
 * Analytics Server Actions
 *
 * Server actions for tracking events and getting analytics data.
 */

import { auth } from '@/features/authentication/lib/next-auth'
import { analyticsService } from '../lib'
import { EventType, DashboardMetrics } from '../types'
import { cookies } from 'next/headers'

/**
 * Get or create session ID for analytics
 */
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('analytics_session')?.value

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    // Note: Setting cookies in server actions requires response context
    // For now, we'll generate a new session ID each time if not found
  }

  return sessionId
}

/**
 * Track a page view
 */
export async function trackPageView(path: string): Promise<void> {
  const session = await auth()
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'page_view',
    userId: session?.user?.id,
    sessionId,
    path
  })
}

/**
 * Track artwork view
 */
export async function trackArtworkView(
  artworkId: string,
  artworkTitle?: string
): Promise<void> {
  const session = await auth()
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'artwork_view',
    userId: session?.user?.id,
    sessionId,
    path: `/artworks/${artworkId}`,
    metadata: artworkTitle ? { title: artworkTitle } : undefined
  })
}

/**
 * Track cart add
 */
export async function trackCartAdd(
  productId: string,
  productTitle?: string
): Promise<void> {
  const session = await auth()
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'cart_add',
    userId: session?.user?.id,
    sessionId,
    metadata: { productId, title: productTitle }
  })
}

/**
 * Track checkout start
 */
export async function trackCheckoutStart(): Promise<void> {
  const session = await auth()
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'checkout_start',
    userId: session?.user?.id,
    sessionId,
    path: '/checkout'
  })
}

/**
 * Track checkout complete
 */
export async function trackCheckoutComplete(orderId: string): Promise<void> {
  const session = await auth()
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'checkout_complete',
    userId: session?.user?.id,
    sessionId,
    path: '/checkout/success',
    metadata: { orderId }
  })
}

/**
 * Track user login
 */
export async function trackUserLogin(userId: string): Promise<void> {
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'user_login',
    userId,
    sessionId,
    path: '/login'
  })
}

/**
 * Track user registration
 */
export async function trackUserRegister(userId: string): Promise<void> {
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'user_register',
    userId,
    sessionId,
    path: '/register'
  })
}

/**
 * Track search
 */
export async function trackSearch(query: string): Promise<void> {
  const session = await auth()
  const sessionId = await getSessionId()

  await analyticsService.trackEvent({
    eventType: 'search',
    userId: session?.user?.id,
    sessionId,
    metadata: { query }
  })
}

/**
 * Get analytics dashboard data (admin only)
 */
export async function getAnalyticsDashboard(): Promise<{
  success: boolean
  metrics?: DashboardMetrics
  error?: string
}> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user is admin (you may want to add proper role check)
    // For now, we'll allow any authenticated user

    const metrics = await analyticsService.getDashboardMetrics()

    return { success: true, metrics }
  } catch (error) {
    console.error('Error getting analytics dashboard:', error)
    return { success: false, error: 'Failed to get analytics' }
  }
}
