import ProductsService from '@/lib/products/products.service'
import ArtworksClient from './ArtworksClient'

// Server Component
export default async function ArtworksPage() {
  // Fetch all products (artworks)
  const { products } = await new ProductsService().getAll('createdAt', 'DESC')

  // Enrich with artist data
  const artworks = products.map((artwork) => ({
    ...artwork
  }))

  // Get unique categories and styles for filters, filter out undefined
  const categories = [
    ...new Set(artworks.map((a) => a.category).filter((c): c is string => !!c))
  ]
  const styles = [
    ...new Set(artworks.map((a) => a.style).filter((s): s is string => !!s))
  ]

  // Pass to a client component for filtering/searching
  return (
    <ArtworksClient
      artworks={artworks}
      categories={categories}
      styles={styles}
    />
  )
}
