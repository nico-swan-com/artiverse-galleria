'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart.context'
import {
  ChevronLeft,
  Heart,
  HeartOff,
  Share2,
  ShoppingCart,
  ZoomIn
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import ArtworkCard from '@/components/public/artwork/ArtworkCard'
import { toast } from 'sonner'
import { Product } from '@/lib/products/model/product.schema'

interface ArtworkDetailClientProps {
  artwork: Product
  relatedArtworks: Product[]
}

export default function ArtworkDetailClient({
  artwork,
  relatedArtworks
}: ArtworkDetailClientProps) {
  const { addToCart } = useCart()
  const imageUrls = (artwork.images || []).filter(
    (img): img is string => typeof img === 'string'
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(
    imageUrls[0] ||
      (typeof artwork.featureImage === 'string' ? artwork.featureImage : null)
  )
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  // Define the allowed availability values
  //type AvailabilityType = 'Available' | 'Sold' | 'Reserved'
  // const getAvailability = (artwork: Product): AvailabilityType => {
  //   if (
  //     artwork.stock &&
  //     typeof artwork.stock === 'number' &&
  //     artwork.stock <= 0
  //   ) {
  //     return 'Sold'
  //   }
  //   return 'Available'
  // }

  const handleAddToCart = () => {
    addToCart({
      ...artwork,
      images: Array.isArray(artwork.images)
        ? artwork.images.filter(
            (img: unknown): img is string => typeof img === 'string'
          )
        : [],
      yearCreated:
        typeof artwork.yearCreated === 'number' ? artwork.yearCreated : 0,
      medium: typeof artwork.medium === 'string' ? artwork.medium : '',
      dimensions:
        typeof artwork.dimensions === 'string' ? artwork.dimensions : '',
      weight: typeof artwork.weight === 'string' ? artwork.weight : '',
      category: typeof artwork.category === 'string' ? artwork.category : '',
      style: typeof artwork.style === 'string' ? artwork.style : ''
    })
    toast('Added to cart', {
      description: `${artwork.title} has been added to your cart.`
    })
  }

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev)
    toast(isFavorite ? 'Removed from wishlist' : 'Added to wishlist', {
      description: `${artwork.title} has been ${isFavorite ? 'removed from' : 'added to'} your wishlist.`
    })
  }

  const shareArtwork = () => {
    navigator.clipboard.writeText(currentUrl)
    toast('Link copied', {
      description: 'Artwork link has been copied to clipboard.'
    })
  }

  return (
    <div className='min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6'>
          <Button variant='ghost' asChild size='sm'>
            <Link href='/artworks' className='flex items-center text-gray-600'>
              <ChevronLeft className='mr-1 size-4' /> Back to Gallery
            </Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          {/* Artwork Images Section */}
          <div className='space-y-4'>
            <div className='relative aspect-square overflow-hidden rounded-lg bg-gray-100'>
              <Dialog>
                <DialogTrigger asChild>
                  <div className='h-full cursor-zoom-in'>
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt={artwork.title}
                        className='size-full object-contain'
                        width={500}
                        height={500}
                      />
                    )}
                    <div className='absolute bottom-4 right-4 rounded-full bg-white/80 p-2 backdrop-blur-sm'>
                      <ZoomIn className='size-5 text-gray-700' />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogTitle>{artwork.title}</DialogTitle>
                <DialogContent className='h-[80vh] max-w-5xl'>
                  <div className='flex h-full items-center justify-center'>
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt={artwork.title}
                        className='max-h-full max-w-full object-contain'
                        width={500}
                        height={500}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {imageUrls.length > 1 && (
              <div className='flex space-x-2 overflow-x-auto pb-2'>
                {imageUrls.map((image, index) => (
                  <button
                    key={image + index}
                    onClick={() => setSelectedImage(image)}
                    className={`size-20 shrink-0 overflow-hidden rounded-md border-2 ${
                      selectedImage === image
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${artwork.title} view ${index + 1}`}
                      className='size-full object-cover'
                      width={500}
                      height={500}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Details Section */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {artwork.title}
              </h1>
            </div>

            <div className='flex items-center space-x-2'>
              <div className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium'>
                {artwork.category}
              </div>
              <div className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium'>
                {artwork.style}
              </div>
              {/* Availability is not a field on Product, so we can show stock or similar */}
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  artwork.stock && artwork.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {artwork.stock && artwork.stock > 0 ? 'Available' : 'Sold'}
              </div>
            </div>

            <p className='text-3xl font-bold'>
              ${artwork.price.toLocaleString()}
            </p>

            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Button
                  onClick={handleAddToCart}
                  disabled={!artwork.stock || artwork.stock < 1}
                  className='w-full'
                >
                  <ShoppingCart className='mr-2 size-4' />
                  Add to Cart
                </Button>
                <Button
                  variant={isFavorite ? 'destructive' : 'outline'}
                  onClick={toggleFavorite}
                  className='w-full'
                >
                  {isFavorite ? (
                    <>
                      <HeartOff className='mr-2 size-4' />
                      Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <Heart className='mr-2 size-4' />
                      Add to Wishlist
                    </>
                  )}
                </Button>
              </div>
              <Button variant='ghost' onClick={shareArtwork} className='w-full'>
                <Share2 className='mr-2 size-4' />
                Share Artwork
              </Button>
            </div>

            <div className='space-y-4 border-y py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Year Created</p>
                  <p className='font-medium'>{artwork.yearCreated}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Medium</p>
                  <p className='font-medium'>{artwork.medium}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Dimensions</p>
                  <p className='font-medium'>{artwork.dimensions}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Weight</p>
                  <p className='font-medium'>{artwork.weight}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold'>About this Artwork</h3>
              <p className='text-gray-700'>{artwork.description}</p>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold'>
                Shipping Information
              </h3>
              <p className='text-gray-700'>
                Free shipping within the US. International shipping available at
                additional cost. Please allow 7-10 business days for preparation
                and shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Related Artworks Section */}
        {relatedArtworks.length > 0 && (
          <div className='mt-16'>
            <h2 className='mb-6 text-2xl font-bold text-gray-900'>
              You May Also Like
            </h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {relatedArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
