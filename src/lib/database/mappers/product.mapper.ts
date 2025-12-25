import { products, artists } from '../schema'
import { Product } from '../../../types/products/product.schema'
import type { InferSelectModel } from 'drizzle-orm'

/**
 * Type for Drizzle query result with artist relation
 */
type ProductWithArtist = InferSelectModel<typeof products> & {
  artist: InferSelectModel<typeof artists> | null
}

/**
 * Maps Drizzle product result to application Product type
 * Handles decimal to number conversion and null to undefined conversion
 */
export function mapProductToAppType(
  product: InferSelectModel<typeof products>
): Product {
  return {
    ...product,
    price: Number(product.price),
    sales: Number(product.sales),
    stock: Number(product.stock),
    yearCreated: product.yearCreated ?? undefined,
    medium: product.medium ?? undefined,
    dimensions: product.dimensions ?? undefined,
    weight: product.weight ?? undefined,
    style: product.style ?? undefined,
    featureImage: product.featureImage ?? undefined,
    images: product.images ?? undefined,
    artistId: product.artistId ?? undefined,
    deletedAt: product.deletedAt ?? undefined
  } as Product
}

/**
 * Maps Drizzle product with artist relation to application Product type
 */
export function mapProductWithArtistToAppType(
  product: ProductWithArtist
): Product {
  return {
    ...mapProductToAppType(product),
    artist: product.artist ?? undefined
  } as Product
}

/**
 * Maps array of Drizzle products to application Product array
 */
export function mapProductsToAppType(
  productRows: InferSelectModel<typeof products>[]
): Product[] {
  return productRows.map(mapProductToAppType)
}

/**
 * Maps array of Drizzle products with artist relation to application Product array
 */
export function mapProductsWithArtistToAppType(
  productRows: ProductWithArtist[]
): Product[] {
  return productRows.map(mapProductWithArtistToAppType)
}
