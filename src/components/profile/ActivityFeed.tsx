'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  getUserActivity,
  ActivityEvent
} from '@/features/orders/actions/orders.actions'
import {
  ShoppingBag,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Calendar,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const ITEMS_PER_PAGE = 10

const activityConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  order_placed: {
    icon: <ShoppingBag className='size-4' />,
    color: 'text-blue-600 bg-blue-50',
    label: 'Order Placed'
  },
  payment_initiated: {
    icon: <CreditCard className='size-4' />,
    color: 'text-orange-600 bg-orange-50',
    label: 'Payment Started'
  },
  payment_completed: {
    icon: <CheckCircle className='size-4' />,
    color: 'text-green-600 bg-green-50',
    label: 'Payment Completed'
  },
  payment_cancelled: {
    icon: <XCircle className='size-4' />,
    color: 'text-red-600 bg-red-50',
    label: 'Cancelled'
  },
  status_processing: {
    icon: <Clock className='size-4' />,
    color: 'text-yellow-600 bg-yellow-50',
    label: 'Processing'
  },
  status_paid: {
    icon: <CheckCircle className='size-4' />,
    color: 'text-green-600 bg-green-50',
    label: 'Paid'
  }
}

const defaultConfig = {
  icon: <Clock className='size-4' />,
  color: 'text-gray-600 bg-gray-50',
  label: 'Update'
}

const eventTypeOptions = [
  { value: 'all', label: 'All Events' },
  { value: 'order_placed', label: 'Order Placed' },
  { value: 'payment_initiated', label: 'Payment Started' },
  { value: 'payment_completed', label: 'Payment Completed' },
  { value: 'payment_cancelled', label: 'Cancelled' }
]

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' }
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' }
]

function getDateRangeStart(range: string): Date | null {
  const now = new Date()
  switch (range) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case '7days':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90days':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    default:
      return null
  }
}

export default function ActivityFeed() {
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchActivity() {
      const result = await getUserActivity()
      if (result.success && result.activity) {
        setActivity(result.activity)
      }
      setLoading(false)
    }
    fetchActivity()
  }, [])

  // Filter and sort activity
  const filteredActivity = useMemo(() => {
    let result = [...activity]

    // Search by order ID
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((event) =>
        event.orderId.toLowerCase().includes(query)
      )
    }

    // Event type filter
    if (eventFilter !== 'all') {
      result = result.filter((event) => event.type === eventFilter)
    }

    // Date range filter
    const dateStart = getDateRangeStart(dateRange)
    if (dateStart) {
      result = result.filter((event) => new Date(event.date) >= dateStart)
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [activity, searchQuery, eventFilter, dateRange, sortOrder])

  // Calculate pagination
  const totalPages = Math.ceil(filteredActivity.length / ITEMS_PER_PAGE)
  const paginatedActivity = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredActivity.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredActivity, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, eventFilter, dateRange, sortOrder])

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-gray-400' />
      </div>
    )
  }

  if (activity.length === 0) {
    return (
      <div className='flex h-[200px] flex-col items-center justify-center text-center'>
        <div className='mb-4 rounded-full bg-gray-50 p-4'>
          <Clock className='size-8 text-gray-400' />
        </div>
        <h3 className='text-lg font-medium text-gray-900'>No activity yet</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Your recent activity will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='border-b border-gray-100 pb-4'>
        <h2 className='text-lg font-semibold text-gray-900'>Recent Activity</h2>
        <p className='text-sm text-gray-500'>
          {filteredActivity.length} event
          {filteredActivity.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
        <Input
          type='text'
          placeholder='Search by Order ID...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-9'
        />
      </div>

      {/* Filters Row */}
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-2'>
          <Filter className='size-4 text-gray-400' />
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Event Type' />
            </SelectTrigger>
            <SelectContent>
              {eventTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Calendar className='size-4 text-gray-400' />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Date' />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <ArrowUpDown className='size-4 text-gray-400' />
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Sort' />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity list */}
      {paginatedActivity.length === 0 ? (
        <div className='py-8 text-center text-gray-500'>
          No events match your filters
        </div>
      ) : (
        <div className='space-y-3'>
          {paginatedActivity.map((item) => {
            const config = activityConfig[item.type] || defaultConfig

            return (
              <div
                key={item.id}
                className='flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4'
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
                >
                  {config.icon}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-medium text-gray-500'>
                      {config.label}
                    </span>
                    <span className='text-xs text-gray-400'>•</span>
                    <span className='font-mono text-xs text-gray-400'>
                      {item.orderId.split('-').pop()}
                    </span>
                  </div>
                  <p className='mt-0.5 text-sm text-gray-900'>
                    {item.description}
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    {formatRelativeTime(item.date)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
          <p className='text-sm text-gray-500'>
            Page {currentPage} of {totalPages}
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='mr-1 size-4' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className='ml-1 size-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
