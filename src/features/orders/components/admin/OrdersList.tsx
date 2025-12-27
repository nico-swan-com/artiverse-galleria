'use client'

import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Order } from '@/features/orders/types/order.types'
import TablePagination from '@/components/common/ui/TablePagination'
import { Badge } from '@/components/ui/badge'

interface OrdersListProps {
  orders: Order[]
  total: number
  page: number
  limit: number
  status?: string
}

const OrdersList = ({ orders, total, page, limit }: OrdersListProps) => {
  const searchParams = useSearchParams()
  const paramsURL = new URLSearchParams(Array.from(searchParams.entries()))

  const pages = Math.ceil(total / limit)

  if (orders.length === 0) {
    return (
      <div className='py-10 text-center'>
        <p className='text-muted-foreground'>No orders found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'processing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'delivered':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <>
      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-mono text-xs font-medium'>
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {order.customer.firstName} {order.customer.lastName}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {order.customer.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className='font-medium'>
                    R{order.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className='capitalize'>
                    {order.paymentMethod || '-'}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon' asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className='size-4' />
                        <span className='sr-only'>View Order</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination
        page={page}
        pages={pages}
        limitPages={limit}
        searchParamsUrl={paramsURL}
      />
    </>
  )
}

export default OrdersList
