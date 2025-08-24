import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel'

import { Product } from '@/types/products/product.schema'
import ProductsService from '@/lib/products/products.service'

export default async function Hero() {
  const productService = new ProductsService()
  const featuredArtworks = await productService.getFeaturedProducts()

  return (
    <section className='relative bg-gray-50 px-4 py-20 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
          <div>
            <h1 className='mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl'>
              Welcome to Artiverse
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
            <Carousel>
              <CarouselContent>
                {featuredArtworks.map(
                  (artwork: Product) =>
                    artwork.featureImage && (
                      <CarouselItem key={artwork.id}>
                        <Link href={`/artworks/${artwork.id}`}>
                          <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                            <Image
                              src={artwork.featureImage as string}
                              alt={artwork.title}
                              fill
                              className='object-cover object-center'
                              sizes='(max-width: 768px) 100vw, 50vw'
                            />
                          </div>
                        </Link>
                      </CarouselItem>
                    )
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}
