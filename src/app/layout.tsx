import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AnimatePresence } from 'framer-motion'
import QueryProvider from '@/contexts/QueryProvider'

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
    'Explore our curated collection of original artworks from talented artists around the world. Each piece comes with its own story and identity.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <QueryProvider>
          <AnimatePresence mode='wait'>{children}</AnimatePresence>
        </QueryProvider>
      </body>
    </html>
  )
}
