import '../globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/cart.context'
import AnimatePresenceWrapper from '@/components/common/utility/AnimatePresenceWrapper'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CartProvider>
      <Navbar />
      <div className='min-h-screen bg-gray-50 px-4 pb-10 pt-20 sm:px-6 lg:px-8'>
        <AnimatePresenceWrapper mode='wait'>{children}</AnimatePresenceWrapper>
      </div>
      <Footer />
    </CartProvider>
  )
}
