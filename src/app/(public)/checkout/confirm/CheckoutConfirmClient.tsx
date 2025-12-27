'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Loader2, CreditCard } from 'lucide-react'
import { confirmMockPayment, getOrder } from '@/features/billing/actions'
import { Order } from '@/features/billing/types'

export default function CheckoutConfirmClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const orderId = searchParams.get('orderId')
  const paymentId = searchParams.get('paymentId')
  const isMock = searchParams.get('mock') === 'true'

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
        // Order fetch failed
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  const handleConfirmPayment = async () => {
    if (!orderId || !paymentId) return

    setConfirming(true)
    try {
      const result = await confirmMockPayment(orderId, paymentId)
      if (result.success) {
        setConfirmed(true)
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${orderId}`)
        }, 1500)
      }
    } catch {
      // Error handling
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='mx-auto size-8 animate-spin text-gray-400' />
          <p className='mt-4 text-gray-600'>Loading order...</p>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100'>
            <Check className='size-8 text-green-600' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Payment Confirmed!
          </h1>
          <p className='mt-2 text-gray-600'>
            Redirecting to order confirmation...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-lg'>
        <div className='rounded-lg bg-white p-8 shadow-sm'>
          <div className='mb-6 text-center'>
            <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100'>
              <CreditCard className='size-8 text-blue-600' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Confirm Payment
            </h1>
            {isMock && (
              <span className='mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800'>
                Test Mode
              </span>
            )}
          </div>

          {order && (
            <div className='mb-6 rounded-lg bg-gray-50 p-4'>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Order ID</span>
                  <span className='font-mono font-medium'>{order.id}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Items</span>
                  <span>{order.items.length}</span>
                </div>
                <div className='flex justify-between border-t pt-2 font-medium'>
                  <span>Total Amount</span>
                  <span className='text-lg'>
                    R{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isMock ? (
            <div className='space-y-4'>
              <p className='text-center text-sm text-gray-600'>
                This is a test payment. Click below to simulate a successful
                payment.
              </p>
              <Button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className='w-full'
                size='lg'
              >
                {confirming ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className='mr-2 size-4' />
                    Confirm Test Payment
                  </>
                )}
              </Button>
              <Button asChild variant='outline' className='w-full'>
                <Link href={`/checkout/cancel?orderId=${orderId}`}>Cancel</Link>
              </Button>
            </div>
          ) : (
            <p className='text-center text-sm text-gray-600'>
              Redirecting to payment provider...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
