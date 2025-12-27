import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import CheckoutSuccessClient from './CheckoutSuccessClient'

export const dynamic = 'force-dynamic'

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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
