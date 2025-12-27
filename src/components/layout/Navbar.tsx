'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/contexts/cart.context'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from '@/components/common/Logo'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { UI_CONSTANTS } from '@/shared/constants/app-constants'

const Navbar = () => {
  const { data: session } = useSession()
  const { getItemCount } = useCart()
  const [itemCount, setItemCount] = useState(0)
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > UI_CONSTANTS.NAVBAR_SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    setItemCount(getItemCount())
  }, [getItemCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const navbarClasses = cn(
    'fixed top-0 left-0 right-0 w-full z-50 transition-all duration-400 ease-swift-out',
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
  )

  const navLinkClasses =
    'relative text-gallery-black hover:text-black transition-colors duration-300 py-2'
  const activeNavLinkClasses =
    'font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gallery-black after:transform'

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/artworks', label: 'Artworks' },
    { path: '/artists', label: 'Artists' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <header className={navbarClasses}>
      <nav className='container mx-auto flex items-center justify-between px-6 py-4'>
        <Logo />

        {!isMobile && (
          <ul className='hidden space-x-8 md:flex'>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={cn(
                    navLinkClasses,
                    pathname === link.path && activeNavLinkClasses
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className='flex items-center space-x-5'>
          <button
            onClick={toggleSearch}
            className='p-1 text-gallery-black transition-colors hover:text-black'
            aria-label='Search'
          >
            <Search size={isMobile ? 20 : 24} />
          </button>

          <Link
            href='/cart'
            className='relative p-1 text-gallery-black transition-colors hover:text-black'
            aria-label='Shopping Cart'
          >
            <ShoppingCart size={isMobile ? 20 : 24} />
            {itemCount > 0 && (
              <span className='absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gallery-black text-xs font-medium text-white'>
                {itemCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                className='relative h-9 w-9 rounded-full'
                asChild
              >
                <Link href='/profile'>
                  <User size={24} />
                </Link>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => signOut({ callbackUrl: '/' })}
                title='Log out'
              >
                <LogOut size={24} />
              </Button>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/login'>Login</Link>
              </Button>
              <Button asChild size='sm'>
                <Link href='/register'>Register</Link>
              </Button>
            </div>
          )}

          {isMobile && (
            <button
              onClick={toggleMenu}
              className='p-1 text-gallery-black transition-colors hover:text-black'
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </nav>

      {isMobile && isMenuOpen && (
        <div className='fixed inset-0 z-50 animate-fade-in bg-white pt-20'>
          <div className='container mx-auto px-6 py-8'>
            <ul className='flex flex-col space-y-6'>
              {navLinks.map((link) => (
                <li
                  key={link.path}
                  className='border-b border-gallery-light-gray pb-4'
                >
                  <Link
                    href={link.path}
                    className='font-display text-2xl tracking-tight text-gallery-black transition-colors hover:text-black'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className='fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-white/95 backdrop-blur-md'>
          <div className='container mx-auto px-6 py-20'>
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='font-display text-2xl'>Search</h2>
              <button
                onClick={toggleSearch}
                className='text-gallery-black transition-colors hover:text-black'
                aria-label='Close Search'
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className='w-full'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search for artworks, artists, or styles...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full border-b-2 border-gallery-black bg-transparent px-4 py-3 text-lg outline-none placeholder:text-gallery-dark-gray/70'
                  autoFocus
                />
                <button
                  type='submit'
                  className='absolute right-0 top-0 h-full px-4 text-gallery-black transition-colors hover:text-black'
                  aria-label='Submit Search'
                >
                  <Search size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
