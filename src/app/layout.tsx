import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AnimatePresence } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import QueryProvider from '@/contexts/query-provider.context'
import { initializeDatabase } from '@/lib/database/data-source'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Artiverse Galleria',
  description:
    'Explore our curated collection of original artworks from talented artists around the world. Each piece comes with its own story and identity.'
}
export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  await initializeDatabase()

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <AnimatePresence mode='wait'>{children}</AnimatePresence>
          </QueryProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
