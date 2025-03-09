import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/CartContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Artiverse Gallerria',
  description:
    "Explore our curated collection of original artworks from talented artists around the world. Each piece comes with it's own story and identity."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
