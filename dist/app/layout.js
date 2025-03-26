import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/CartContext'
import { SessionProvider } from 'next-auth/react'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})
export const metadata = {
  title: 'Artiverse Gallerria',
  description:
    "Explore our curated collection of original artworks from talented artists around the world. Each piece comes with it's own story and identity."
}
export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <SessionProvider
          // session={session}
          // // Default base path if your app lives at the root "/"
          // basePath="/"
          // Re-fetch session every 5 minutes
          refetchInterval={5 * 60}
          // Re-fetches session when window is focused
          refetchOnWindowFocus={true}
        >
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
