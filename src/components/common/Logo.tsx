import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <Link href='/' className='flex items-center'>
      <Image
        src='/logo.svg'
        alt='Artiverse Galleria'
        width={150}
        height={40}
        priority
        className='h-10 w-auto'
      />
    </Link>
  )
}
