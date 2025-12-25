'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/cart.context'
import AnimatePresenceWrapper from '@/components/common/utility/AnimatePresenceWrapper'
import { SessionProvider } from 'next-auth/react'

export default function ClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <CartProvider>
        <Navbar />
        <div className='container mx-auto min-h-screen px-4 pb-10 pt-20 sm:px-6 lg:px-8'>
          <AnimatePresenceWrapper mode='wait'>
            {children}
          </AnimatePresenceWrapper>
        </div>
        <Footer />
      </CartProvider>
    </SessionProvider>
  )
}
