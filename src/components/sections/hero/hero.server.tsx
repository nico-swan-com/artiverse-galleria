import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface HeroProps {
  featureImageUrl: string
}

const Hero = ({ featureImageUrl }: HeroProps) => {
  return (
    <section className='relative bg-gray-50 px-4 py-20 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
          <div>
            <h1 className='mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl'>
              Discover Unique Art for Your Space
            </h1>
            <p className='mb-8 text-lg text-gray-600'>
              Explore our curated collection of original artworks from talented
              artists around the world. Each piece comes with its own story and
              identity.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button asChild size='lg'>
                <Link href='/artworks'>Browse Gallery</Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/artists'>Meet Our Artists</Link>
              </Button>
            </div>
          </div>
          <div className='relative overflow-hidden rounded-lg shadow-xl'>
            {featureImageUrl && (
              <Image
                src={featureImageUrl}
                alt='Featured artwork'
                className='aspect-[4/3] size-full object-cover'
                width={800}
                height={600}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
