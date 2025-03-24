import '../globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/CartContext'
import { AnimatePresence } from 'framer-motion'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CartProvider>
      <Navbar />
      <AnimatePresence mode='wait'>{children}</AnimatePresence>
      <Footer />
      <Toaster />
    </CartProvider>
  )
}
