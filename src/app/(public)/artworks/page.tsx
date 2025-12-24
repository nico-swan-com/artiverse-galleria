import ProductsService from '@/lib/products/products.service'
import ArtworksClient from './ArtworksClient'

import { Product } from '@/types/products/product.schema'

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

// Server Component
export default async function ArtworksPage() {
  try {
    // Fetch all products (artworks)
    const { products } = await new ProductsService().getAll('createdAt', 'DESC')

    // Enrich with artist data
    const artworks = products.map((artwork: Product) => artwork)

    // Convert to plain objects for client component
    const plainArtworks = artworks as Product[]

    // Get unique categories and styles for filters, filter out undefined
    const categories = [
      ...new Set(
        plainArtworks
          .map((a: Product) => a.category as string)
          .filter((c: string): c is string => typeof c === 'string' && !!c)
      )
    ]
    const styles = [
      ...new Set(
        plainArtworks
          .map((a: Product) => a.style as string)
          .filter((s: string): s is string => typeof s === 'string' && !!s)
      )
    ]

    // Pass to a client component for filtering/searching
    return (
      <ArtworksClient
        artworks={plainArtworks}
        categories={categories}
        styles={styles}
      />
    )
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>
            Error Loading Artworks
          </h2>
          <p className='text-gray-600'>
            Unable to load artworks at this time. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
