'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { INavbarProps } from './NavbarProps.interface'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { signOut, useSession } from 'next-auth/react'

interface SidebarProps extends INavbarProps {
  className?: string
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  menuItems,
  isCollapsed,
  setIsCollapsed
}) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { data: session } = useSession()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={cn(
        'h-full border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className,
        !isMobile && 'relative' // Change to relative when not mobile
      )}
    >
      <div className='flex h-16 items-center justify-between border-b border-sidebar-border px-4'>
        {!isCollapsed && (
          <div className='flex items-center space-x-2'>
            <div className='flex size-8 items-center justify-center rounded-md bg-primary'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='size-5 text-white'
              >
                <circle cx='12' cy='12' r='10' />
                <path d='M8 12h8' />
                <path d='M12 8v8' />
              </svg>
            </div>
            <span className='text-lg font-semibold'>Commerce</span>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleSidebar}
          className='text-muted-foreground hover:text-foreground'
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <div className='overflow-y-auto py-4'>
        <ul className='space-y-1 px-2'>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                  pathname === item.path
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                <span className='flex items-center justify-center'>
                  {item.icon}
                </span>
                {!isCollapsed && <span className='ml-3'>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className='border-t border-sidebar-border p-4'>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className='flex flex-1 items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>{session?.user?.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {session?.user?.email}
                </p>
              </div>
              <Button
                onClick={() => signOut()}
                variant='ghost'
                size='icon'
                className='text-muted-foreground hover:text-foreground'
              >
                <LogOut size={18} />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <Button
              onClick={() => signOut()}
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
