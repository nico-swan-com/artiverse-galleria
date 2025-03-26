import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react'
const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className='bg-gallery-black pb-8 pt-16 text-white'>
      <div className='container mx-auto px-6'>
        <div className='mb-12 grid grid-cols-1 gap-12 md:grid-cols-4'>
          {/* Logo and Info */}
          <div className='md:col-span-1'>
            <Link
              href='/'
              className='font-display text-2xl tracking-tight transition-opacity hover:opacity-80'
            >
              <span className='font-bold'>Artiverse</span>
            </Link>
            <p className='mt-4 text-sm leading-relaxed text-gray-300'>
              Curating exceptional artworks from talented artists around the
              world. Discover, collect, and connect with the art that speaks to
              you.
            </p>
          </div>

          {/* Quick Links */}
          <div className='md:col-span-1'>
            <h4 className='mb-4 font-display text-lg'>Explore</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/artworks'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  All Artworks
                </Link>
              </li>
              <li>
                <Link
                  href='/artists'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href='/collections'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className='md:col-span-1'>
            <h4 className='mb-4 font-display text-lg'>Information</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/about'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='md:col-span-1'>
            <h4 className='mb-4 font-display text-lg'>Stay Connected</h4>
            <p className='mb-4 text-sm text-gray-300'>
              Subscribe to our newsletter for updates on new arrivals and
              exhibitions.
            </p>
            <form className='flex flex-col sm:flex-row md:flex-col'>
              <input
                type='email'
                placeholder='Your email address'
                className='mb-2 rounded-sm bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-white/50 sm:mb-0 sm:mr-2 md:mb-2 md:mr-0'
                aria-label='Email address for newsletter'
              />
              <button
                type='submit'
                className='rounded-sm bg-white px-4 py-2 text-sm font-medium text-gallery-black transition-colors hover:bg-gray-200'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className='flex flex-col items-center justify-between border-t border-white/20 pt-8 md:flex-row'>
          <div className='mb-4 flex space-x-6 md:mb-0'>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-300 transition-colors hover:text-white'
              aria-label='Instagram'
            >
              <Instagram size={20} />
            </a>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-300 transition-colors hover:text-white'
              aria-label='Facebook'
            >
              <Facebook size={20} />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-300 transition-colors hover:text-white'
              aria-label='Twitter'
            >
              <Twitter size={20} />
            </a>
            <a
              href='mailto:info@artiverse.com'
              className='text-gray-300 transition-colors hover:text-white'
              aria-label='Email'
            >
              <Mail size={20} />
            </a>
          </div>

          <div className='text-sm text-gray-400'>
            &copy; {currentYear} Artiverse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
