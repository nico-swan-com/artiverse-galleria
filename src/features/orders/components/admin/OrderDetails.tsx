'use client'

import React from 'react'
import { Order } from '@/features/orders/types/order.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OrderDetailsProps {
  order: Order
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const router = useRouter()

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
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.back()}
          className='size-8'
        >
          <ArrowLeft className='size-4' />
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild className='h-8'>
            <a
              href={`/orders/${order.id}/invoice`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Print Invoice
            </a>
          </Button>
          <h1 className='text-2xl font-bold tracking-tight'>
            Order #{order.id}
          </h1>
        </div>
        <Badge className={`ml-2 border-0 ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='space-y-6'>
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {order.items.map((item, index) => (
                  <div key={index} className='flex items-start justify-between'>
                    <div className='flex gap-4'>
                      <div className='flex size-16 items-center justify-center rounded bg-muted text-lg font-bold text-muted-foreground'>
                        {item.quantity}x
                      </div>
                      <div>
                        <p className='font-medium'>{item.product.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          SKU: {item.product.sku}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        R{item.totalPrice.toLocaleString()}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        R{item.unitPrice.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className='my-4' />
              <div className='space-y-1.5'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>R{order.subtotal.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span>R{order.shipping.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Tax</span>
                  <span>R{order.tax.toLocaleString()}</span>
                </div>
                <Separator className='my-2' />
                <div className='flex justify-between font-medium'>
                  <span>Total</span>
                  <span>R{order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='grid grid-cols-2 gap-1 text-sm'>
                <span className='text-muted-foreground'>Method:</span>
                <span className='capitalize'>{order.paymentMethod || '-'}</span>
              </div>
              <div className='grid grid-cols-2 gap-1 text-sm'>
                <span className='text-muted-foreground'>Transaction ID:</span>
                <span className='truncate font-mono'>
                  {order.paymentId || '-'}
                </span>
              </div>
              <div className='grid grid-cols-2 gap-1 text-sm'>
                <span className='text-muted-foreground'>Date:</span>
                <span>
                  {format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-[80px_1fr] items-start gap-2 text-sm'>
                <div className='text-muted-foreground'>Name</div>
                <div className='font-medium'>
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <div className='text-muted-foreground'>Email</div>
                <div>{order.customer.email}</div>
                <div className='text-muted-foreground'>Phone</div>
                <div>{order.customer.phone || '-'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>
              <address className='not-italic'>
                {order.customer.address}
                <br />
                {order.customer.city}
                <br />
                {order.customer.state}, {order.customer.zip}
                <br />
                {order.customer.country}
              </address>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
