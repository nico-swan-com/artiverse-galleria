'use client'

import { useState, useEffect } from 'react'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './logo/Logo'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const navigation = [{ name: 'Home', path: '/' }]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-primary/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='shrink-0'>
            <Link href='/'>
              <Logo />
            </Link>
          </div>
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-orange-500 ${
                    pathname === item.path ? 'text-secondary' : 'text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-orange-500 focus:outline-none'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? 'h-auto opacity-100' : 'h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className='space-y-1 bg-primary/80 px-2 pb-3 pt-2 backdrop-blur-md sm:px-3'>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                pathname === item.path
                  ? 'text-secondary'
                  : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
