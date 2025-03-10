'use client'

import '../globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'

const queryClient = new QueryClient()

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Navbar />
        <AnimatePresence mode='wait'>{children}</AnimatePresence>
        <Footer />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  )
}
