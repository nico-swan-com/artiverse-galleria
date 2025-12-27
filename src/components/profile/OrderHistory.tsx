'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  getUserOrders,
  OrderSummary
} from '@/features/billing/actions/user-orders.actions'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
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

const ITEMS_PER_PAGE = 5

const statusConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  pending: {
    icon: <Clock className='size-4' />,
    color: 'text-yellow-600 bg-yellow-50',
    label: 'Pending'
  },
  processing: {
    icon: <Loader2 className='size-4 animate-spin' />,
    color: 'text-blue-600 bg-blue-50',
    label: 'Processing'
  },
  paid: {
    icon: <CheckCircle className='size-4' />,
    color: 'text-green-600 bg-green-50',
    label: 'Paid'
  },
  complete: {
    icon: <CheckCircle className='size-4' />,
    color: 'text-green-600 bg-green-50',
    label: 'Complete'
  },
  shipped: {
    icon: <Package className='size-4' />,
    color: 'text-indigo-600 bg-indigo-50',
    label: 'Shipped'
  },
  cancelled: {
    icon: <XCircle className='size-4' />,
    color: 'text-red-600 bg-red-50',
    label: 'Cancelled'
  }
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'cancelled', label: 'Cancelled' }
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

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchOrders() {
      const result = await getUserOrders()
      if (result.success && result.orders) {
        setOrders(result.orders)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Search by order ID
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((order) => order.id.toLowerCase().includes(query))
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Date range filter
    const dateStart = getDateRangeStart(dateRange)
    if (dateStart) {
      result = result.filter((order) => new Date(order.createdAt) >= dateStart)
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [orders, searchQuery, statusFilter, dateRange, sortOrder])

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrders, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, dateRange, sortOrder])

  if (loading) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-gray-400' />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className='flex h-[200px] flex-col items-center justify-center text-center'>
        <div className='mb-4 rounded-full bg-gray-50 p-4'>
          <Package className='size-8 text-gray-400' />
        </div>
        <h3 className='text-lg font-medium text-gray-900'>No orders yet</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Your order history will appear here after you make a purchase.
        </p>
        <Button asChild className='mt-4'>
          <Link href='/artworks'>Browse Artworks</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='border-b border-gray-100 pb-4'>
        <h2 className='text-lg font-semibold text-gray-900'>Order History</h2>
        <p className='text-sm text-gray-500'>
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
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

      {/* Orders list */}
      {paginatedOrders.length === 0 ? (
        <div className='py-8 text-center text-gray-500'>
          No orders match your filters
        </div>
      ) : (
        <div className='divide-y divide-gray-100'>
          {paginatedOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending

            return (
              <div
                key={order.id}
                className='flex items-center justify-between py-4'
              >
                <div className='flex items-start gap-4'>
                  <div className='rounded-lg bg-gray-50 p-3'>
                    <Package className='size-5 text-gray-600' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      Order #{order.id.split('-').pop()}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} •{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <span className='text-lg font-semibold text-gray-900'>
                    R{order.total.toLocaleString()}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                  <Button variant='outline' size='sm' asChild className='h-8'>
                    <a
                      href={`/orders/${order.id}/invoice`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Invoice
                    </a>
                  </Button>
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
