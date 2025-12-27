'use client'

import { useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel'
import { Product } from '@/types/products/product.schema'

interface HeroCarouselProps {
  artworks: Product[]
}

export default function HeroCarousel({ artworks }: HeroCarouselProps) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const handleMouseEnter = useCallback(() => {
    autoplayPlugin.current.stop()
  }, [])

  const handleMouseLeave = useCallback(() => {
    autoplayPlugin.current.play()
  }, [])

  return (
    <div
      className='relative overflow-hidden rounded-lg shadow-xl'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        opts={{
          loop: true
        }}
        plugins={[autoplayPlugin.current]}
      >
        <CarouselContent>
          {artworks.map(
            (artwork: Product) =>
              artwork.featureImage && (
                <CarouselItem key={artwork.id}>
                  <Link href={`/artworks/${artwork.id}`}>
                    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-lg'>
                      <Image
                        src={artwork.featureImage as string}
                        alt={artwork.title}
                        fill
                        className='object-cover object-center transition-transform duration-500 hover:scale-105'
                        sizes='(max-width: 768px) 100vw, 50vw'
                      />
                      {/* Artwork info overlay */}
                      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                        <h3 className='text-lg font-semibold text-white'>
                          {artwork.title}
                        </h3>
                      </div>
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
  )
}
