import ProductsService from '@/lib/products/products.service'
import ArtworkDetailClient from './ArtworkDetailClient'
import { notFound } from 'next/navigation'
import { instanceToPlain } from 'class-transformer'
import { Product } from '@/lib/products'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

export default async function ArtworkDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const product = await new ProductsService().getById(id)
    if (!product) return notFound()

    // Enrich with artist, ensuring createdAt/updatedAt are always present
    const artwork = instanceToPlain(product) as Product

    // Fetch all products to find related artworks
    const { products: allProducts } = await new ProductsService().getAll(
      'createdAt',
      'DESC'
    )
    const relatedArtworks = allProducts
      .filter(
        (a) =>
          a.id !== artwork.id &&
          (a.category === artwork.category ||
            a.style === artwork.style ||
            a.artistId === artwork.artistId)
      )
      .slice(0, 3)

    return (
      <ArtworkDetailClient
        artwork={artwork}
        relatedArtworks={relatedArtworks}
      />
    )
  } catch (error) {
    console.error('Error fetching artwork:', error)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>
            Error Loading Artwork
          </h2>
          <p className='text-gray-600'>
            Unable to load artwork at this time. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
