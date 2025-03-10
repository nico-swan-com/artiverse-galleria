'use client'

import '../globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useIsMobile } from '@/hooks/use-mobile'
import Sidebar from '@/components/store-back/layout/Sidebar'
import MobileNavbar from '@/components/store-back/layout/MobileNavbar'
import { BarChart3, FileText, Package, Users, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const queryClient = new QueryClient()

export default function StoreBackLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { status } = useSession()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    switch (status) {
      case 'authenticated':
        setIsAuthenticated(true)
        router.push('/dashboard')
        break
      case 'unauthenticated':
        setIsAuthenticated(false)
        router.push('/login')
        break
      default:
        break
    }
  }, [status, router])

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <BarChart3 size={18} />,
      path: '/'
    },
    {
      title: 'Blog',
      icon: <FileText size={18} />,
      path: '/blog'
    },
    {
      title: 'Products',
      icon: <Package size={18} />,
      path: '/products'
    },
    {
      title: 'Users',
      icon: <Users size={18} />,
      path: '/users'
    },
    {
      title: 'Billing',
      icon: <CreditCard size={18} />,
      path: '/billing'
    }
  ]
  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-secondary/50 p-4'>
        <div className='w-full max-w-md animate-slide-up'>
          {children}
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className='grid min-h-screen bg-background'
        style={{
          gridTemplateColumns: `${!isMobile ? (isCollapsed ? '4rem 1fr' : '16rem 1fr') : '1fr'}`
        }}
      >
        {!isMobile && (
          <Sidebar
            menuItems={menuItems}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}
        <div className='flex flex-col'>
          <MobileNavbar menuItems={menuItems} />
          <main className='flex-1 transition-all duration-300 ease-in-out'>
            <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8'>
              <AnimatePresence mode='wait'>{children}</AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}
