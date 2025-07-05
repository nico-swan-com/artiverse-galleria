import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import QueryProvider from '@/contexts/query-provider.context'
import { Toaster } from 'sonner'
import AnimatePresenceWrapper from '@/components/common/utility/AnimatePresenceWrapper'

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
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <AnimatePresenceWrapper mode='wait'>
              {children}
            </AnimatePresenceWrapper>
            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
