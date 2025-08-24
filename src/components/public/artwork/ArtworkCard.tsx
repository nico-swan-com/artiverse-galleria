import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/cart.context'
import { ShoppingCart, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/database/data/artworks'
import { Product } from '@/types/products/product.schema'

interface ArtworkCardProps {
  artwork: Product
  className?: string
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, className }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  //const { addToCart, cart } = useCart()
  //const isInCart = cart.some((item) => item.artwork.id === artwork.id)
  const { addToCart } = useCart()
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart(artwork)
  }

  return (
    <div className={cn('artwork-card group', className)}>
      <Link href={`/artworks/${artwork.id}`} className='flex h-full flex-col'>
        {/* Image */}
        <div className='relative mb-4 aspect-[4/5] overflow-hidden rounded-sm'>
          <Image
            src={(artwork.featureImage as string) || ''}
            alt={artwork.title}
            fill
            className={cn(
              'object-cover transition-all duration-400',
              isImageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-xl'
            )}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Overlay with actions */}
          <div className='absolute inset-0 bg-black/0 opacity-0 transition-all duration-400 ease-swift-out group-hover:bg-black/30 group-hover:opacity-100'>
            <div className='absolute bottom-4 right-4 flex space-x-2'>
              <button
                className='flex size-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all duration-400 ease-swift-out group-hover:translate-y-0 group-hover:opacity-100'
                onClick={handleAddToCart}
                aria-label='Add to cart'
              >
                <ShoppingCart size={18} />
              </button>
              <button
                className='flex size-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all delay-75 duration-400 ease-swift-out group-hover:translate-y-0 group-hover:opacity-100'
                aria-label='Add to wishlist'
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* Status tag */}
          {artwork.stock === 0 && (
            <div className='absolute left-4 top-4 rounded-sm bg-black px-2 py-1 text-xs font-medium text-white'>
              Sold Out
            </div>
          )}
        </div>

        {/* Artwork info */}
        <div className='flex grow flex-col'>
          <h3 className='font-display text-lg font-medium text-gray-900 transition-colors group-hover:text-black'>
            {artwork.title}
          </h3>
          <div className='mt-2 flex items-center justify-between'>
            <p className='font-medium'>{formatPrice(artwork.price)}</p>
            <div className='text-xs text-gray-500'>{artwork?.medium}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ArtworkCard
