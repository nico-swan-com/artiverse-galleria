'use client'

import React, { useState, useRef, useEffect } from 'react'
import { formatPrice, getRelatedArtworks } from '@/data/artworks'
import { Artwork } from '@/types/artwork'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingCart,
  Info,
  ExternalLink
} from 'lucide-react'
//import QRCode from '@/components/QRCode'
import ArtworkCard from '@/components/artwork/ArtworkCard'
import { cn } from '@/lib/utils'

interface ArtworkDetailProps {
  artwork: Artwork
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork }) => {
  const { addToCart, isInCart } = useCart()
  const artist = artwork.artist
  const relatedArtworks = getRelatedArtworks(artwork, 4)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  //const [setZoomPosition] = useState({ x: 0, y: 0 })
  const [showQRCode, setShowQRCode] = useState(false)

  const imageRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)

  const hasPrevImage = currentImageIndex > 0
  const hasNextImage = currentImageIndex < artwork.images.length - 1

  const handlePrevImage = () => {
    if (hasPrevImage) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (hasNextImage) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !zoomRef.current || !isZoomed) return

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    //setZoomPosition({ x, y })

    // Position the zoom glass
    zoomRef.current.style.left = `${e.clientX - 75}px`
    zoomRef.current.style.top = `${e.clientY - 75}px`
    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`
    zoomRef.current.style.backgroundImage = `url(${artwork.images[currentImageIndex]})`
    zoomRef.current.style.backgroundSize = '200%'
    zoomRef.current.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
    if (zoomRef.current) {
      zoomRef.current.style.opacity = '0'
    }
  }

  const handleToggleZoom = () => {
    setIsZoomed(!isZoomed)
    if (!isZoomed && zoomRef.current) {
      zoomRef.current.style.opacity = '1'
    } else if (zoomRef.current) {
      zoomRef.current.style.opacity = '0'
    }
  }

  const handleAddToCart = () => {
    addToCart(artwork)
  }

  // Clear zoom when image changes
  useEffect(() => {
    setIsZoomed(false)
    if (zoomRef.current) {
      zoomRef.current.style.opacity = '0'
    }
  }, [currentImageIndex])

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
        {/* Left column - Artwork images */}
        <div className='relative'>
          {/* Main image */}
          <div
            ref={imageRef}
            className={cn(
              'magnify-container mb-4 aspect-[4/3] overflow-hidden rounded-sm bg-gallery-light-gray',
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            )}
            onClick={handleToggleZoom}
            onMouseMove={isZoomed ? handleMouseMove : undefined}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={artwork.images[currentImageIndex]}
              alt={`${artwork.title} - View ${currentImageIndex + 1}`}
              className='size-full object-contain'
            />

            {/* Zoom glass */}
            <div ref={zoomRef} className='magnify-glass'></div>
          </div>

          {/* Thumbnails */}
          {artwork.images.length > 1 && (
            <div className='mb-8 flex items-center justify-center space-x-4'>
              <button
                onClick={handlePrevImage}
                disabled={!hasPrevImage}
                className={cn(
                  'rounded-full p-2',
                  hasPrevImage
                    ? 'bg-gallery-black text-white transition-colors hover:bg-black'
                    : 'cursor-not-allowed bg-gallery-light-gray text-gallery-medium-gray'
                )}
                aria-label='Previous image'
              >
                <ArrowLeft size={18} />
              </button>

              <div className='flex max-w-[calc(100%-120px)] items-center space-x-2 overflow-x-auto py-2'>
                {artwork.images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      'h-16 w-16 overflow-hidden rounded-sm border-2 transition-all',
                      index === currentImageIndex
                        ? 'border-gallery-black'
                        : 'border-transparent hover:border-gallery-medium-gray'
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className='size-full object-cover'
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextImage}
                disabled={!hasNextImage}
                className={cn(
                  'rounded-full p-2',
                  hasNextImage
                    ? 'bg-gallery-black text-white transition-colors hover:bg-black'
                    : 'cursor-not-allowed bg-gallery-light-gray text-gallery-medium-gray'
                )}
                aria-label='Next image'
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* QR Code */}
          <div className='mt-4 flex justify-center'>
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className='flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700'
            >
              <Info size={16} className='mr-2' />
              {showQRCode ? 'Hide' : 'Show'} QR Code
            </button>

            {showQRCode && (
              <div className='absolute z-10 mt-8 animate-fade-in transition-all duration-300'>
                {/* <QRCode
                  url={window.location.href}
                  title={`${artwork.title} by ${artist.name}`}
                  size={150}
                /> */}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Artwork details */}
        <div className='flex flex-col'>
          {/* Title and Artist */}
          <h1 className='mb-2 text-3xl font-medium text-gray-900 md:text-4xl'>
            {artwork.title}
          </h1>
          <Link
            to={`/artists/${artist.id}`}
            className='mb-6 text-xl text-gray-600 transition-colors hover:text-gray-900'
          >
            {artist.name}
          </Link>

          {/* Price and status */}
          <div className='mb-8 flex items-center justify-between'>
            <div className='text-2xl font-medium'>
              {formatPrice(artwork.price)}
            </div>
            <div
              className={cn(
                'rounded-sm px-3 py-1 text-sm font-medium',
                artwork.availability === 'Available'
                  ? 'bg-green-100 text-green-800'
                  : artwork.availability === 'Sold'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
              )}
            >
              {artwork.availability}
            </div>
          </div>

          {/* Action buttons */}
          <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
            <button
              onClick={handleAddToCart}
              disabled={artwork.availability === 'Sold' || isInCart(artwork.id)}
              className={cn(
                'flex flex-1 items-center justify-center rounded-sm px-6 py-3 font-medium transition-all',
                artwork.availability === 'Sold' || isInCart(artwork.id)
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-gray-900 text-white hover:bg-black'
              )}
            >
              <ShoppingCart size={18} className='mr-2' />
              {isInCart(artwork.id) ? 'Added to Cart' : 'Add to Cart'}
            </button>

            <button className='flex flex-1 items-center justify-center rounded-sm border border-gray-900 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100'>
              <Heart size={18} className='mr-2' />
              Add to Wishlist
            </button>
          </div>

          {/* Artwork details */}
          <div className='mb-8 border-y border-gray-200 py-6'>
            <h3 className='mb-4 text-lg font-medium'>Details</h3>
            <dl className='grid grid-cols-2 gap-y-3 text-sm'>
              <dt className='text-gray-500'>Year</dt>
              <dd>{artwork.yearCreated}</dd>

              <dt className='text-gray-500'>Medium</dt>
              <dd>{artwork.medium}</dd>

              <dt className='text-gray-500'>Dimensions</dt>
              <dd>{artwork.dimensions}</dd>

              {artwork.weight && (
                <>
                  <dt className='text-gray-500'>Weight</dt>
                  <dd>{artwork.weight}</dd>
                </>
              )}

              <dt className='text-gray-500'>Categories</dt>
              <dd className='flex flex-wrap gap-1'>
                <span className='inline-block rounded-sm bg-gray-100 px-2 py-0.5 text-xs'>
                  {artwork.category}
                </span>
                <span className='inline-block rounded-sm bg-gray-100 px-2 py-0.5 text-xs'>
                  {artwork.style}
                </span>
              </dd>
            </dl>
          </div>

          {/* Artwork description */}
          <div className='mb-8'>
            <h3 className='mb-4 text-lg font-medium'>About the Artwork</h3>
            <p className='leading-relaxed text-gray-600'>
              {artwork.description}
            </p>
          </div>

          {/* Shipping information */}
          <div className='mb-8 rounded-sm bg-gray-100 p-4'>
            <h3 className='mb-2 flex items-center text-sm font-medium'>
              <Info size={16} className='mr-2' />
              Shipping & Returns
            </h3>
            <p className='text-sm text-gray-600'>
              This artwork includes professional packaging and insurance.
              Shipping costs calculated at checkout. Returns accepted within 14
              days of delivery.
            </p>
            <a
              href='/shipping'
              className='mt-2 inline-flex items-center text-sm font-medium text-gray-900 hover:text-black'
            >
              Learn more
              <ExternalLink size={14} className='ml-1' />
            </a>
          </div>
        </div>
      </div>

      {/* Related artworks */}
      {relatedArtworks.length > 0 && (
        <div className='mt-16 border-t border-gray-200 pt-12'>
          <h2 className='mb-8 text-2xl font-medium'>You May Also Like</h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {relatedArtworks.map((relatedArtwork) => (
              <ArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtworkDetail
