'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsDashboard } from '@/features/analytics/actions/analytics.actions'
import { DashboardMetrics } from '@/features/analytics/types/analytics.types'
import {
  Eye,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  BarChart3,
  Clock
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  icon: React.ReactNode
  color: string
}

function MetricCard({ title, value, trend, icon, color }: MetricCardProps) {
  return (
    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-500'>{title}</p>
          <p className='mt-2 text-3xl font-bold text-gray-900'>{value}</p>
          {trend !== undefined && (
            <div className='mt-2 flex items-center gap-1'>
              {trend >= 0 ? (
                <TrendingUp className='size-4 text-green-500' />
              ) : (
                <TrendingDown className='size-4 text-red-500' />
              )}
              <span
                className={`text-sm font-medium ${
                  trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend >= 0 ? '+' : ''}
                {trend}%
              </span>
              <span className='text-sm text-gray-500'>vs last period</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

const eventTypeLabels: Record<string, string> = {
  page_view: 'Page View',
  artwork_view: 'Artwork View',
  cart_add: 'Added to Cart',
  checkout_start: 'Checkout Started',
  checkout_complete: 'Order Completed',
  user_login: 'User Login',
  user_register: 'New Registration',
  search: 'Search'
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      const result = await getAnalyticsDashboard()
      if (result.success && result.metrics) {
        setMetrics(result.metrics)
      }
      setLoading(false)
    }
    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-gray-400' />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className='flex h-[400px] flex-col items-center justify-center text-center'>
        <BarChart3 className='mb-4 size-12 text-gray-300' />
        <p className='text-gray-500'>Unable to load analytics</p>
      </div>
    )
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>
          Analytics Dashboard
        </h2>
        <p className='text-gray-500'>Last 30 days overview</p>
      </div>

      {/* Metrics Grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <MetricCard
          title='Page Views'
          value={metrics.totalPageViews.toLocaleString()}
          trend={metrics.pageViewsTrend}
          icon={<Eye className='size-5 text-blue-600' />}
          color='bg-blue-50'
        />
        <MetricCard
          title='Unique Visitors'
          value={metrics.uniqueVisitors.toLocaleString()}
          icon={<Users className='size-5 text-purple-600' />}
          color='bg-purple-50'
        />
        <MetricCard
          title='Total Orders'
          value={metrics.totalOrders}
          trend={metrics.ordersTrend}
          icon={<ShoppingCart className='size-5 text-green-600' />}
          color='bg-green-50'
        />
        <MetricCard
          title='Revenue'
          value={`R${metrics.totalRevenue.toLocaleString()}`}
          trend={metrics.revenueTrend}
          icon={<DollarSign className='size-5 text-amber-600' />}
          color='bg-amber-50'
        />
      </div>

      {/* Secondary Stats */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Conversion Rates */}
        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Conversion Funnel
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Cart → Checkout</span>
              <span className='text-lg font-semibold text-gray-900'>
                {metrics.cartToCheckoutRate}%
              </span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
              <div
                className='h-full rounded-full bg-blue-500 transition-all'
                style={{ width: `${metrics.cartToCheckoutRate}%` }}
              />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Checkout → Order</span>
              <span className='text-lg font-semibold text-gray-900'>
                {metrics.checkoutToOrderRate}%
              </span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
              <div
                className='h-full rounded-full bg-green-500 transition-all'
                style={{ width: `${metrics.checkoutToOrderRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Popular Artworks */}
        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Popular Artworks
          </h3>
          {metrics.popularArtworks.length === 0 ? (
            <p className='text-gray-500'>No artwork views yet</p>
          ) : (
            <div className='space-y-3'>
              {metrics.popularArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <span className='flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600'>
                      {index + 1}
                    </span>
                    <span className='text-gray-900'>{artwork.title}</span>
                  </div>
                  <span className='text-sm text-gray-500'>
                    {artwork.views} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Recent Activity
        </h3>
        {metrics.recentEvents.length === 0 ? (
          <p className='text-gray-500'>No recent activity</p>
        ) : (
          <div className='space-y-3'>
            {metrics.recentEvents.map((event, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3'
              >
                <div className='flex items-center gap-3'>
                  <Clock className='size-4 text-gray-400' />
                  <span className='font-medium text-gray-900'>
                    {eventTypeLabels[event.eventType] || event.eventType}
                  </span>
                  {event.path && (
                    <span className='text-sm text-gray-500'>{event.path}</span>
                  )}
                </div>
                <span className='text-sm text-gray-500'>
                  {formatRelativeTime(event.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
