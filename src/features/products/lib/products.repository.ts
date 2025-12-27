import { PaginationParams } from '@/types/common/pagination-params.type'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { db } from '@/lib/database/drizzle'
import { products, artists } from '@/lib/database/schema'
import { eq, and, ne, or, sql, desc, asc, count } from 'drizzle-orm'
import {
  validateSearchQuery,
  buildSearchFilter
} from '@/lib/utilities/search-query.util'
import { ProductsSortBy } from '@/types/products/products-sort-by.type'
import { Products } from '@/types/products/products.type'
import {
  ProductCreate,
  ProductUpdate,
  Product
} from '@/types/products/product.schema'
import { ProductFilters } from '@/types/products/product-filters.type'
import {
  mapProductsWithArtistToAppType,
  mapProductWithArtistToAppType,
  mapProductToAppType
} from '@/lib/database/mappers/product.mapper'
import { logger } from '@/lib/utilities/logger'

class ProductsRepository {
  async getAll(
    sortByField: ProductsSortBy = 'title',
    sortOrder: FindOptionsOrderValue = 'ASC'
  ): Promise<Products> {
    try {
      const orderDir = sortOrder === 'DESC' ? desc : asc
      const result = await db.query.products.findMany({
        orderBy: [orderDir(products[sortByField])],
        with: {
          artist: true
        }
      })

      const convertedResult = mapProductsWithArtistToAppType(result)

      return {
        products: convertedResult,
        total: result.length
      }
    } catch (error) {
      logger.error('Error getting products', error, { sortByField, sortOrder })
      throw error
    }
  }

  async getPaged(
    pagination: PaginationParams,
    sortByField: ProductsSortBy = 'createdAt',
    sortOrder: FindOptionsOrderValue = 'DESC',
    filters: ProductFilters = {}
  ): Promise<Products> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit
    const orderDir = sortOrder === 'DESC' ? desc : asc
    const { searchQuery, category, style, minPrice, maxPrice } = filters

    // Validate and build search filter
    const validatedQuery = validateSearchQuery(searchQuery)
    const searchConditions = buildSearchFilter(validatedQuery, [
      products.title,
      products.description,
      products.category
    ])

    // Build additional filters
    const filterConditions = []
    if (searchConditions) filterConditions.push(searchConditions)
    if (category) filterConditions.push(eq(products.category, category))
    if (style) filterConditions.push(eq(products.style, style))
    if (minPrice !== undefined)
      filterConditions.push(sql`${products.price} >= ${minPrice}`)
    if (maxPrice !== undefined)
      filterConditions.push(sql`${products.price} <= ${maxPrice}`)

    const finalFilter =
      filterConditions.length > 0 ? and(...filterConditions) : undefined

    try {
      // Get data
      const data = await db.query.products.findMany({
        where: finalFilter,
        limit: limit,
        offset: offset,
        orderBy: [orderDir(products[sortByField])],
        with: {
          artist: true
        }
      })

      // Get count
      const rows = await db
        .select({ count: count() })
        .from(products)
        .where(finalFilter)
      const total = rows[0].count

      const convertedResult = mapProductsWithArtistToAppType(data)

      return {
        products: convertedResult,
        total
      }
    } catch (error) {
      logger.error('Error getting paged products', error, {
        pagination,
        sortByField,
        sortOrder,
        filters
      })
      throw error
    }
  }

  async getById(id: string): Promise<Product | null> {
    try {
      const found = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
          artist: true
        }
      })

      if (!found) return null

      return mapProductWithArtistToAppType(found)
    } catch (error) {
      logger.error('Error getting product by id', error, { id })
      throw error
    }
  }

  async getByArtistId(artistId: string): Promise<Product[]> {
    try {
      const result = await db.query.products.findMany({
        where: eq(products.artistId, artistId),
        with: {
          artist: true
        }
      })

      return mapProductsWithArtistToAppType(result)
    } catch (error) {
      logger.error('Error getting products by artist', error, { artistId })
      throw error
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const result = await db.query.products.findMany({
        where: eq(products.featured, true),
        with: {
          artist: true
        }
      })

      return mapProductsWithArtistToAppType(result)
    } catch (error) {
      logger.error('Error getting featured products', error)
      throw error
    }
  }

  async create(product: ProductCreate): Promise<Product> {
    try {
      // Drizzle insert returns the inserted row
      const [inserted] = await db
        .insert(products)
        .values({
          // sku is auto-generated
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock,
          sales: product.sales.toString(),
          yearCreated: product.yearCreated ?? null,
          medium: product.medium ?? null,
          dimensions: product.dimensions ?? null,
          weight: product.weight ?? null,
          style: product.style ?? null,
          featureImage: (product.featureImage as string) ?? null,
          images: (product.images as string[]) ?? null,
          featured: product.featured ?? false,
          productType: product.productType ?? 'physical',
          category: product.category,
          artistId: product.artistId
        })
        .returning()

      return mapProductToAppType(inserted)
    } catch (error) {
      logger.error('Error creating product', error)
      throw error
    }
  }

  async update(product: ProductUpdate): Promise<void> {
    try {
      if (!product.id) throw new Error('Product ID is required for update')

      const { id, ...updateData } = product

      // Prepare update object, filtering undefined
      const definedUpdates: Record<string, unknown> = {}
      for (const key in updateData) {
        const val = updateData[key as keyof typeof updateData]
        if (val !== undefined) {
          if (key === 'price' || key === 'sales') {
            definedUpdates[key] = val.toString()
          } else {
            definedUpdates[key] = val
          }
        }
      }

      definedUpdates.updatedAt = new Date()

      await db.update(products).set(definedUpdates).where(eq(products.id, id))

      return
    } catch (error) {
      logger.error('Error updating product', error, { productId: product.id })
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(products).where(eq(products.id, id))
      return
    } catch (error) {
      logger.error('Error deleting product', error, { id })
      throw error
    }
  }

  async findRelated(
    artworkId: string,
    category: string,
    artistId: string
  ): Promise<Product[]> {
    try {
      // Equivalent to:
      // where id != artworkId AND (category = category OR artistId = artistId)
      // orderBy RANDOM() limit 4

      const result = await db
        .select()
        .from(products)
        .where(
          and(
            ne(products.id, artworkId),
            or(eq(products.category, category), eq(products.artistId, artistId))
          )
        )
        .orderBy(sql`RANDOM()`)
        .limit(4)
        // Note: Relation loading in query builder (.select().from()) requires .leftJoin manually OR use db.query...findMany
        // For Random order, db.query API might not support sql`RANDOM()` easily in orderBy (it expects column).
        // Actually it might support sql helpers.
        // Let's stick to query builder for this complex query to be safe, but we need to fetch artist too?
        // Old code: .leftJoinAndSelect('product.artist', 'artist')
        // So yes.
        .leftJoin(artists, eq(products.artistId, artists.id))

      // Result will be { products: ..., artists: ... } objects
      // We need to map it back to structure expected.

      return result.map(({ products: p, artists: a }) => {
        const product = mapProductToAppType(p)
        return {
          ...product,
          artist: a ?? undefined
        } as Product
      })
    } catch (error) {
      logger.error('Error finding related products', error, {
        artworkId,
        category,
        artistId
      })
      throw error
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const result = await db
        .selectDistinct({ category: products.category })
        .from(products)
        .where(ne(products.category, ''))
        .orderBy(asc(products.category))

      return result.map((r) => r.category).filter(Boolean) as string[]
    } catch (error) {
      logger.error('Error getting categories', error)
      throw error
    }
  }

  async getStyles(): Promise<string[]> {
    try {
      const result = await db
        .selectDistinct({ style: products.style })
        .from(products)
        .where(ne(products.style, ''))
        .orderBy(asc(products.style))

      return result.map((r) => r.style).filter(Boolean) as string[]
    } catch (error) {
      logger.error('Error getting styles', error)
      throw error
    }
  }
}

const productsRepository = new ProductsRepository()

export { ProductsRepository, productsRepository }
