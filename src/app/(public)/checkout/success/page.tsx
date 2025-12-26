'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Package, ArrowRight, Loader2 } from 'lucide-react'
import { getOrder } from '@/features/billing/actions'
import { Order } from '@/features/billing/types'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        router.push('/cart')
        return
      }

      try {
        const result = await getOrder(orderId)
        if (result.success && result.order) {
          setOrder(result.order)
        }
      } catch {
        // Order might not be found
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='mx-auto size-8 animate-spin text-gray-400' />
          <p className='mt-4 text-gray-600'>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <div className='mb-6 inline-flex size-20 items-center justify-center rounded-full bg-green-100'>
          <Check className='size-10 text-green-600' strokeWidth={3} />
        </div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900'>
          Payment Successful!
        </h1>

        <p className='mb-2 text-lg text-gray-600'>
          Thank you for your order. Your payment has been processed
          successfully.
        </p>

        {orderId && (
          <p className='mb-8 text-sm text-gray-500'>
            Order Number:{' '}
            <span className='font-mono font-medium'>{orderId}</span>
          </p>
        )}

        {order && (
          <div className='mb-8 rounded-lg bg-white p-6 text-left shadow-sm'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-900'>
              <Package className='size-5' />
              Order Summary
            </h2>
            <div className='space-y-2 text-sm text-gray-600'>
              <div className='flex justify-between'>
                <span>Items</span>
                <span>{order.items.length}</span>
              </div>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>R{order.subtotal.toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? 'Free' : `R${order.shipping}`}
                </span>
              </div>
              <div className='flex justify-between border-t pt-2 text-base font-medium text-gray-900'>
                <span>Total</span>
                <span>R{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <p className='mb-8 text-sm text-gray-500'>
          A confirmation email has been sent to your email address.
        </p>

        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button asChild size='lg'>
            <Link href='/artworks'>
              Continue Shopping
              <ArrowRight className='ml-2 size-4' />
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href='/profile'>View Order History</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <Loader2 className='mx-auto size-8 animate-spin text-gray-400' />
        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
