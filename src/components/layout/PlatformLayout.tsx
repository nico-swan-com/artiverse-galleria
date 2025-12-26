'use client'
import { AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import Sidebar from '@/components/layout/navigation/Sidebar'
import MobileNavbar from '@/components/layout/navigation/MobileNavbar'
import {
  BarChart3,
  Package,
  Palette,
  Images,
  UserRound,
  UsersRound
} from 'lucide-react'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Breadcrumbs } from '../common/ui/Breadcrumbs'

export default function PlatformLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart3 size={18} />,
      path: '/admin'
    },
    {
      id: 'users',
      title: 'Users',
      icon: <UsersRound size={18} />,
      path: '/admin/users'
    },
    {
      id: 'artists',
      title: 'Artists',
      icon: (
        <>
          <div className='relative'>
            <Palette
              size={12}
              className='absolute right-0 top-[2px] mr-[-8px]'
            />
            <UserRound size={18} />
          </div>
        </>
      ),
      path: '/admin/artists'
    },
    {
      id: 'products',
      title: 'Products',
      icon: <Package size={18} />,
      path: '/admin/products'
    },
    {
      id: 'media',
      title: 'Media',
      icon: <Images size={18} />,
      path: '/admin/media'
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <UserRound size={18} />,
      path: '/profile'
    }
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
              <Breadcrumbs />
              <AnimatePresence mode='wait'>{children}</AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
