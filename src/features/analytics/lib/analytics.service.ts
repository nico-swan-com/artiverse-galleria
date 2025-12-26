/**
 * Analytics Service
 *
 * Service for tracking events and calculating metrics.
 */

import 'server-only'
import { db } from '@/lib/database'
import {
  analyticsEvents,
  orders,
  products,
  NewAnalyticsEvent,
  AnalyticsEventDb
} from '@/lib/database/schema'
import { eq, desc, gte, lte, and, sql, count } from 'drizzle-orm'
import { logger } from '@/lib/utilities/logger'
import {
  EventType,
  TrackEventInput,
  DashboardMetrics,
  DateRange
} from '../types'

class AnalyticsService {
  /**
   * Track an analytics event
   */
  async trackEvent(input: TrackEventInput): Promise<void> {
    try {
      const event: NewAnalyticsEvent = {
        eventType: input.eventType,
        userId: input.userId,
        sessionId: input.sessionId,
        path: input.path,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null
      }

      await db.insert(analyticsEvents).values(event)

      logger.debug('Analytics event tracked', {
        eventType: input.eventType,
        path: input.path
      })
    } catch (error) {
      // Don't throw - analytics should never break the app
      logger.error('Failed to track analytics event', error as Error)
    }
  }

  /**
   * Get dashboard metrics for admin
   */
  async getDashboardMetrics(dateRange?: DateRange): Promise<DashboardMetrics> {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const start = dateRange?.start || thirtyDaysAgo
    const end = dateRange?.end || now
    const previousStart = new Date(
      start.getTime() - (end.getTime() - start.getTime())
    )

    try {
      // Current period metrics
      const [pageViewsResult] = await db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'page_view'),
            gte(analyticsEvents.createdAt, start),
            lte(analyticsEvents.createdAt, end)
          )
        )

      const [uniqueVisitorsResult] = await db
        .select({
          count: sql<number>`COUNT(DISTINCT ${analyticsEvents.sessionId})`
        })
        .from(analyticsEvents)
        .where(
          and(
            gte(analyticsEvents.createdAt, start),
            lte(analyticsEvents.createdAt, end)
          )
        )

      const [ordersResult] = await db
        .select({ count: count() })
        .from(orders)
        .where(and(gte(orders.createdAt, start), lte(orders.createdAt, end)))

      const [revenueResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
        })
        .from(orders)
        .where(
          and(
            eq(orders.status, 'paid'),
            gte(orders.createdAt, start),
            lte(orders.createdAt, end)
          )
        )

      // Previous period for trends
      const [prevPageViews] = await db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'page_view'),
            gte(analyticsEvents.createdAt, previousStart),
            lte(analyticsEvents.createdAt, start)
          )
        )

      const [prevOrders] = await db
        .select({ count: count() })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, previousStart),
            lte(orders.createdAt, start)
          )
        )

      const [prevRevenue] = await db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`
        })
        .from(orders)
        .where(
          and(
            eq(orders.status, 'paid'),
            gte(orders.createdAt, previousStart),
            lte(orders.createdAt, start)
          )
        )

      // Popular artworks (by views)
      const artworkViews = await db
        .select({
          path: analyticsEvents.path,
          views: count()
        })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'artwork_view'),
            gte(analyticsEvents.createdAt, start)
          )
        )
        .groupBy(analyticsEvents.path)
        .orderBy(desc(count()))
        .limit(5)

      // Map artwork paths to product info
      const popularArtworks = await Promise.all(
        artworkViews.map(async (view) => {
          const artworkId = view.path?.split('/').pop()
          if (!artworkId) return null

          const [product] = await db
            .select({ id: products.id, title: products.title })
            .from(products)
            .where(eq(products.id, artworkId))
            .limit(1)

          return product
            ? { id: product.id, title: product.title, views: view.views }
            : null
        })
      )

      // Recent events
      const recentEvents = await db
        .select({
          eventType: analyticsEvents.eventType,
          path: analyticsEvents.path,
          createdAt: analyticsEvents.createdAt
        })
        .from(analyticsEvents)
        .orderBy(desc(analyticsEvents.createdAt))
        .limit(10)

      // Conversion rates
      const [cartAdds] = await db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'cart_add'),
            gte(analyticsEvents.createdAt, start)
          )
        )

      const [checkoutStarts] = await db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'checkout_start'),
            gte(analyticsEvents.createdAt, start)
          )
        )

      const [checkoutCompletes] = await db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventType, 'checkout_complete'),
            gte(analyticsEvents.createdAt, start)
          )
        )

      // Calculate trends
      const calcTrend = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
      }

      return {
        totalPageViews: pageViewsResult?.count || 0,
        uniqueVisitors: Number(uniqueVisitorsResult?.count) || 0,
        totalOrders: ordersResult?.count || 0,
        totalRevenue: Number(revenueResult?.total) || 0,
        pageViewsTrend: calcTrend(
          pageViewsResult?.count || 0,
          prevPageViews?.count || 0
        ),
        ordersTrend: calcTrend(
          ordersResult?.count || 0,
          prevOrders?.count || 0
        ),
        revenueTrend: calcTrend(
          Number(revenueResult?.total) || 0,
          Number(prevRevenue?.total) || 0
        ),
        popularArtworks: popularArtworks.filter(
          Boolean
        ) as DashboardMetrics['popularArtworks'],
        recentEvents: recentEvents.map((e) => ({
          eventType: e.eventType as EventType,
          path: e.path || undefined,
          createdAt: e.createdAt
        })),
        cartToCheckoutRate:
          cartAdds?.count && cartAdds.count > 0
            ? Math.round(((checkoutStarts?.count || 0) / cartAdds.count) * 100)
            : 0,
        checkoutToOrderRate:
          checkoutStarts?.count && checkoutStarts.count > 0
            ? Math.round(
                ((checkoutCompletes?.count || 0) / checkoutStarts.count) * 100
              )
            : 0
      }
    } catch (error) {
      logger.error('Failed to get dashboard metrics', error as Error)
      // Return empty metrics on error
      return {
        totalPageViews: 0,
        uniqueVisitors: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pageViewsTrend: 0,
        ordersTrend: 0,
        revenueTrend: 0,
        popularArtworks: [],
        recentEvents: [],
        cartToCheckoutRate: 0,
        checkoutToOrderRate: 0
      }
    }
  }

  /**
   * Get recent events
   */
  async getRecentEvents(limit = 20): Promise<AnalyticsEventDb[]> {
    return db
      .select()
      .from(analyticsEvents)
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(limit)
  }
}

export const analyticsService = new AnalyticsService()
