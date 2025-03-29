import '../globals.css'
import Navbar from '@/components/layout/navbar.component'
import Footer from '@/components/layout/footer.component'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/cart.context'
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
