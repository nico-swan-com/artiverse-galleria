'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { INavbarProps } from './NavbarProps.interface'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'

const MobileNavbar: React.FC<INavbarProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='block sm:hidden'>
      <div className='flex h-16 items-center justify-between border-b border-sidebar-border px-4'>
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
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleMenu}
          className='text-muted-foreground hover:text-foreground'
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {isOpen && (
        <div className='absolute left-0 top-16 z-50 w-full border-b border-sidebar-border bg-background shadow-md'>
          <div className='p-2'>
            <ul className='space-y-1'>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                      pathname === item.path
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <span className='mr-3'>{item.icon}</span>
                    <span>{item.title}</span>
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavbar
