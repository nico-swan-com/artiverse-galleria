import { PaginationParams } from '@/types/common/pagination-params.type'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { ProductsRepository } from './products.repository'
import { ProductsSortBy } from '@/types/products/products-sort-by.type'
import { Products } from '@/types/products/products.type'
import {
  Product,
  ProductCreate,
  ProductUpdate
} from '@/types/products/product.schema'
import { ProductFilters } from '@/types/products/product-filters.type'
import { isBuildPhase } from '@/lib/utilities/build-phase.util'
import { CacheTagGenerator } from '@/lib/cache/cache-tag.util'
import { CACHE_CONFIG } from '@/shared/constants'
import { logger } from '@/lib/utilities/logger'

/**
 * ProductsService handles business logic for product operations
 * Provides caching, build-phase handling, and delegates to repository
 */
export default class ProductsService {
  private repository: ProductsRepository

  /**
   * Creates a new ProductsService instance
   * @param repository - Optional ProductsRepository instance for dependency injection
   */
  constructor(repository?: ProductsRepository) {
    this.repository = repository || new ProductsRepository()
  }

  /**
   * Get all products with sorting
   * @param sortBy - Field to sort by
   * @param order - Sort order (ASC or DESC)
   * @returns Products with total count
   */
  async getAll(
    sortBy: ProductsSortBy,
    order: FindOptionsOrderValue
  ): Promise<Products> {
    // Return empty result during build time
    if (isBuildPhase()) {
      return {
        products: [],
        total: 0
      }
    }

    const orderStr = typeof order === 'string' ? order : 'DESC'
    const tag = CacheTagGenerator.products(sortBy, orderStr)
    const getAll = unstable_cache(
      async (
        sortBy: ProductsSortBy,
        order: FindOptionsOrderValue
      ): Promise<Products> => {
        const result = await this.repository.getAll(sortBy, order)
        return result
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS],
        revalidate: CACHE_CONFIG.DEFAULT_REVALIDATE
      }
    )
    return getAll(sortBy, order)
  }

  async getPaged(
    pagination: PaginationParams,
    sortBy: ProductsSortBy,
    order: FindOptionsOrderValue,
    filters?: ProductFilters
  ): Promise<Products> {
    // Return empty result during build time
    if (isBuildPhase()) {
      return {
        products: [],
        total: 0
      }
    }

    const tag = CacheTagGenerator.productsPaged(
      pagination.page,
      pagination.limit,
      sortBy,
      typeof order === 'string' ? order : 'DESC',
      filters
    )
    const getPaged = unstable_cache(
      async (
        pagination: PaginationParams,
        sortBy: ProductsSortBy,
        order: FindOptionsOrderValue,
        filters?: ProductFilters
      ): Promise<Products> => {
        const result = await this.repository.getPaged(
          pagination,
          sortBy,
          order,
          filters
        )
        return result
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS],
        revalidate: CACHE_CONFIG.SHORT_REVALIDATE
      }
    )
    return getPaged(pagination, sortBy, order, filters)
  }

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Product or null if not found
   */
  async getById(id: string): Promise<Product | null> {
    // Return null during build time
    if (isBuildPhase()) {
      return null
    }

    const tag = CacheTagGenerator.product(id)
    const getById = unstable_cache(
      async (id: string): Promise<Product | null> => {
        const result = await this.repository.getById(id)
        return result
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS]
      }
    )
    return getById(id)
  }

  /**
   * Get featured products
   * @returns Array of featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    // Return empty result during build time
    if (isBuildPhase()) {
      return []
    }

    const tag = CacheTagGenerator.featuredProducts()
    const getFeaturedProductsCached = unstable_cache(
      async (): Promise<Product[]> => {
        try {
          return await this.repository.getFeaturedProducts()
        } catch (error) {
          logger.error('Error getting featured products', error)
          // Return empty array on error to prevent page crashes
          return []
        }
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS],
        revalidate: CACHE_CONFIG.DEFAULT_REVALIDATE
      }
    )
    return getFeaturedProductsCached()
  }

  /**
   * Get products by artist ID
   * @param artistId - Artist ID
   * @returns Array of products by the artist
   */
  async getByArtistId(artistId: string): Promise<Product[]> {
    // Return empty result during build time
    if (isBuildPhase()) {
      return []
    }

    const tag = CacheTagGenerator.productsByArtist(artistId)
    const getByArtistIdCached = unstable_cache(
      async (artistId: string): Promise<Product[]> => {
        return this.repository.getByArtistId(artistId)
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS]
      }
    )
    return getByArtistIdCached(artistId)
  }

  /**
   * Create a new product
   * @param product - Product creation data
   * @returns Created product
   */
  async create(product: ProductCreate): Promise<Product> {
    try {
      const result = await this.repository.create(product)
      return result
    } catch (error) {
      logger.error('Error creating product', error)
      throw error
    }
  }

  /**
   * Update an existing product
   * @param product - Product update data (must include id)
   */
  async update(product: ProductUpdate): Promise<void> {
    try {
      await this.repository.update(product)
      return
    } catch (error) {
      logger.error('Error updating product', error, { productId: product.id })
      throw error
    }
  }

  /**
   * Delete a product by ID
   * @param id - Product ID to delete
   */
  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id)
      return
    } catch (error) {
      logger.error('Error deleting product', error, { id })
      throw error
    }
  }

  /**
   * Find related products based on category and artist
   * @param artworkId - ID of the artwork to exclude from results
   * @param category - Product category to match
   * @param artistId - Artist ID to match
   * @returns Array of related products (max 4, randomly ordered)
   */
  async findRelated(
    artworkId: string,
    category: string,
    artistId: string
  ): Promise<Product[]> {
    try {
      const result = await this.repository.findRelated(
        artworkId,
        category,
        artistId
      )
      return result
    } catch (error) {
      logger.error('Error finding related products', error, {
        artworkId,
        category,
        artistId
      })
      throw error
    }
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    if (isBuildPhase()) return []

    const tag = CacheTagGenerator.categories()
    const getCategories = unstable_cache(
      async () => {
        return this.repository.getCategories()
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS],
        revalidate: CACHE_CONFIG.LONG_CACHE_DURATION
      }
    )
    return getCategories()
  }

  /**
   * Get all unique styles
   */
  async getStyles(): Promise<string[]> {
    if (isBuildPhase()) return []

    const tag = CacheTagGenerator.styles()
    const getStyles = unstable_cache(
      async () => {
        return this.repository.getStyles()
      },
      [tag],
      {
        tags: [tag, CACHE_CONFIG.TAGS.PRODUCTS],
        revalidate: CACHE_CONFIG.LONG_CACHE_DURATION
      }
    )
    return getStyles()
  }
}
