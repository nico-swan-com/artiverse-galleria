'use client'
import { AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import Sidebar from '@/components/layout/navigation/sidebar.component'
import MobileNavbar from '@/components/layout/navigation/mobile-navbar.component'
import { BarChart3, Palette, UserRound, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <BarChart3 size={18} />,
      path: '/admin'
    },
    {
      title: 'Users',
      icon: <UsersRound size={18} />,
      path: '/admin/users'
    },
    {
      title: 'Artists',
      icon: (
        <>
          <div className='relative'>
            <Palette size={12} className='absolute right-0 top-[2] mr-[-8]' />
            <UserRound size={18} />
          </div>
        </>
      ),
      path: '/admin/artists'
    }
    // {
    //   title: 'Blog',
    //   icon: <FileText size={18} />,
    //   path: '/blog'
    // },
    // {
    //   title: 'Products',
    //   icon: <Package size={18} />,
    //   path: '/products'
    // },

    // {
    //   title: 'Billing',
    //   icon: <CreditCard size={18} />,
    //   path: '/billing'
    // }
  ]
  return (
    <SessionProvider>
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
    </SessionProvider>
  )
}
