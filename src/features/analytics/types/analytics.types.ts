/**
 * Analytics Types
 *
 * Type definitions for analytics events and metrics.
 */

/**
 * Event types that can be tracked
 */
export type EventType =
  | 'page_view'
  | 'artwork_view'
  | 'artist_view'
  | 'cart_add'
  | 'cart_remove'
  | 'checkout_start'
  | 'checkout_complete'
  | 'order_placed'
  | 'payment_completed'
  | 'user_login'
  | 'user_register'
  | 'user_logout'
  | 'search'
  | 'filter_applied'

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  id: string
  eventType: EventType
  userId?: string
  sessionId?: string
  path?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

/**
 * Event input for tracking
 */
export interface TrackEventInput {
  eventType: EventType
  userId?: string
  sessionId?: string
  path?: string
  metadata?: Record<string, unknown>
}

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  // Overview
  totalPageViews: number
  uniqueVisitors: number
  totalOrders: number
  totalRevenue: number

  // Trends (vs previous period)
  pageViewsTrend: number
  ordersTrend: number
  revenueTrend: number

  // Popular items
  popularArtworks: {
    id: string
    title: string
    views: number
  }[]

  // Recent activity
  recentEvents: {
    eventType: EventType
    path?: string
    createdAt: Date
  }[]

  // Conversion
  cartToCheckoutRate: number
  checkoutToOrderRate: number
}

/**
 * Date range for metrics queries
 */
export interface DateRange {
  start: Date
  end: Date
}
