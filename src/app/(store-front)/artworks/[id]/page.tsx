'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { artworks, formatPrice, getRelatedArtworks } from '@/data/artworks'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
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
import ArtworkCard from '@/components/artwork/artwork-card.component'
import { toast } from 'sonner'
import QRCode from '@/components/utility/qr.code.component'

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [artwork, setArtwork] = useState<(typeof artworks)[0] | undefined>(
    undefined
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [relatedArtworks, setRelatedArtworks] = useState<typeof artworks>([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true) // Set loading to true when fetching starts
    if (id && typeof id === 'string') {
      const foundArtwork = artworks.find((a) => a.id === id)
      setArtwork(foundArtwork)
    }
  }, [id])

  useEffect(() => {
    if (artwork) {
      setSelectedImage(artwork.images[0])
      setRelatedArtworks(getRelatedArtworks(artwork, 3))
      setIsLoading(false) // Set loading to false when artwork is loaded
    } else if (id) {
      setSelectedImage(null)
      setIsLoading(false) // Set loading to false when artwork is not found
    }
  }, [artwork, id])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(window.location.href)
      setCurrentUrl(window.location.href)
    }
  }, [])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Loading Artwork...</h2>
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Artwork Not Found</h2>
          <Button asChild>
            <Link href='/artworks'>Back to Gallery</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(artwork)
    toast('Added to cart', {
      description: `${artwork.title} has been added to your cart.`
    })
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
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
                      <img
                        src={selectedImage}
                        alt={artwork.title}
                        className='h-full w-full object-contain'
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
                      <img
                        src={selectedImage}
                        alt={artwork.title}
                        className='max-h-full max-w-full object-contain'
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {artwork.images.length > 1 && (
              <div className='flex space-x-2 overflow-x-auto pb-2'>
                {artwork.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`size-20 shrink-0 overflow-hidden rounded-md border-2 ${
                      selectedImage === image
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${artwork.title} view ${index + 1}`}
                      className='size-full object-cover'
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
              <Link
                href={`/artists/${artwork.artist.id}`}
                className='text-primary hover:underline'
              >
                {artwork.artist.name}
              </Link>
            </div>

            <div className='flex items-center space-x-2'>
              <div className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium'>
                {artwork.category}
              </div>
              <div className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium'>
                {artwork.style}
              </div>
              <div
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  artwork.availability === 'Available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {artwork.availability}
              </div>
            </div>

            <p className='text-3xl font-bold'>{formatPrice(artwork.price)}</p>

            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Button
                  onClick={handleAddToCart}
                  disabled={artwork.availability !== 'Available'}
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

            <div className='border-t pt-6'>
              <h3 className='mb-4 text-lg font-semibold'>QR Code</h3>
              <div className='flex items-center space-x-4'>
                <QRCode url={currentUrl} size={250} title={artwork.title} />
                <div>
                  <p className='mb-2 text-sm text-gray-600'>
                    Scan this QR code to easily share this artwork or revisit it
                    later.
                  </p>
                </div>
              </div>
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

export default ArtworkDetail
