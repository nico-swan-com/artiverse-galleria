import Link from 'next/link'
import LogoSVG from './Logo.svg'

const Logo = () => {
  return (
    <div className='flex items-center'>
      <Link
        href='/'
        className='font-display text-xl tracking-tight text-gallery-black transition-opacity hover:opacity-80 md:text-2xl'
      ></Link>
      <LogoSVG className='text-orange-500' height={38} />
      <span className='font-bold'>Artiverse</span>
    </div>
  )
}

export default Logo
