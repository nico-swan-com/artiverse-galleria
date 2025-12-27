import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Product } from '@/types/products/product.schema'
import ProductsService from '@/features/products/lib/products.service'
import HeroCarousel from './HeroCarousel'

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function Hero() {
  const productService = new ProductsService()
  const featuredArtworks = await productService.getFeaturedProducts()

  // Shuffle artworks randomly on each render
  const shuffledArtworks = shuffleArray(
    featuredArtworks.filter((artwork: Product) => artwork.featureImage)
  )

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
          <HeroCarousel artworks={shuffledArtworks} />
        </div>
      </div>
    </section>
  )
}
