import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AnimatePresence } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'

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
    "Explore our curated collection of original artworks from talented artists around the world. Each piece comes with it's own story and identity."
}
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <html lang='en'>
        <body
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
        >
          <AnimatePresence mode='wait'>{children}</AnimatePresence>
        </body>
      </html>
    </SessionProvider>
  )
}
