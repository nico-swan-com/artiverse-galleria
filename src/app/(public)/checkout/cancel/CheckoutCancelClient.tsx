'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'

export default function CheckoutCancelClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <div className='mb-6 inline-flex size-20 items-center justify-center rounded-full bg-red-100'>
          <XCircle className='size-10 text-red-600' />
        </div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900'>
          Payment Cancelled
        </h1>

        <p className='mb-2 text-lg text-gray-600'>
          Your payment was not completed. Don&apos;t worry, no charges were
          made.
        </p>

        {orderId && (
          <p className='mb-8 text-sm text-gray-500'>
            Order Reference:{' '}
            <span className='font-mono font-medium'>{orderId}</span>
          </p>
        )}

        <div className='mb-8 rounded-lg bg-white p-6 shadow-sm'>
          <h2 className='mb-3 text-lg font-medium text-gray-900'>
            What happened?
          </h2>
          <p className='text-sm text-gray-600'>
            You cancelled the payment process, or the payment could not be
            completed. Your cart items are still saved and you can try again
            when ready.
          </p>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button asChild size='lg'>
            <Link href='/cart'>
              <ShoppingCart className='mr-2 size-4' />
              Return to Cart
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href='/artworks'>
              <ArrowLeft className='mr-2 size-4' />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <p className='mt-8 text-xs text-gray-400'>
          If you experienced any issues, please contact our support team.
        </p>
      </div>
    </div>
  )
}
