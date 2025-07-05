import ProductsService from '@/lib/products/products.service'
import ArtworkDetailClient from './ArtworkDetailClient'
import { notFound } from 'next/navigation'

export default async function ArtworkDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await new ProductsService().getById(id)
  if (!product) return notFound()

  // Enrich with artist, ensuring createdAt/updatedAt are always present
  const artwork = product

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
    <ArtworkDetailClient artwork={artwork} relatedArtworks={relatedArtworks} />
  )
}
