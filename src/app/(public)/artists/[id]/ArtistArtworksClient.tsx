'use client'
import ArtworkCard from '@/components/public/artwork/ArtworkCard'
import { Product } from '@/lib/products/model/product.schema'

interface ArtistArtworksClientProps {
  artistArtworks: Product[]
}

export default function ArtistArtworksClient({
  artistArtworks
}: ArtistArtworksClientProps) {
  if (artistArtworks.length > 0) {
    return (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {artistArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    )
  }
  return (
    <div className='py-12 text-center'>
      <p className='text-lg text-gray-600'>
        No artworks currently available from this artist.
      </p>
    </div>
  )
}
