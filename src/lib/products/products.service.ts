import { PaginationParams } from '../../types/common/pagination-params.type'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from '../../types/common/db.type'
import { ProductsRepository } from './products.repository'
import { ProductsSortBy } from '../../types/products/products-sort-by.type'
import { Products } from '../../types/products/products.type'
import {
  Product,
  ProductCreate,
  ProductUpdate
} from '../../types/products/product.schema'

export default class ProductsService {
  repository: ProductsRepository

  constructor() {
    this.repository = new ProductsRepository()
  }

  async getAll(
    sortBy: ProductsSortBy,
    order: FindOptionsOrderValue
  ): Promise<Products> {
    // Return empty result during build time
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      return {
        products: [],
        total: 0
      }
    }

    const tag = `products-${sortBy}-${order}`
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
        tags: [tag, 'products']
      }
    )
    return getAll(sortBy, order)
  }

  async getPaged(
    pagination: PaginationParams,
    sortBy: ProductsSortBy,
    order: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<Products> {
    // Return empty result during build time
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      return {
        products: [],
        total: 0
      }
    }

    const tag = `products-page-${pagination.page}-limit-${pagination.limit}-${sortBy}-${order}`
    const getPaged = unstable_cache(
      async (
        pagination: PaginationParams,
        sortBy: ProductsSortBy,
        order: FindOptionsOrderValue,
        searchQuery?: string
      ): Promise<Products> => {
        const result = await this.repository.getPaged(
          pagination,
          sortBy,
          order,
          searchQuery
        )
        return result
      },
      [tag],
      {
        tags: [tag, 'products'],
        revalidate: 1
      }
    )
    return getPaged(pagination, sortBy, order, searchQuery)
  }

  async getById(id: string): Promise<Product | null> {
    // Return null during build time
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      return null
    }

    const tag = `product-${id}`
    const getById = unstable_cache(
      async (id: string): Promise<Product | null> => {
        const result = await this.repository.getById(id)
        return result
      },
      [tag],
      {
        tags: [tag, 'products']
      }
    )
    return getById(id)
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // Return empty result during build time
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      return []
    }

    const tag = `featured-products`
    const getFeaturedProductsCached = unstable_cache(
      async (): Promise<Product[]> => {
        return this.repository.getFeaturedProducts()
      },
      [tag],
      {
        tags: [tag]
      }
    )
    return getFeaturedProductsCached()
  }

  async getByArtistId(artistId: string): Promise<Product[]> {
    // Return empty result during build time
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      return []
    }

    const tag = `products-artist-${artistId}`
    const getByArtistIdCached = unstable_cache(
      async (artistId: string): Promise<Product[]> => {
        return this.repository.getByArtistId(artistId)
      },
      [tag],
      {
        tags: [tag, 'products']
      }
    )
    return getByArtistIdCached(artistId)
  }

  async create(product: ProductCreate): Promise<Product> {
    try {
      const result = await this.repository.create(product)
      return result
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async update(product: ProductUpdate): Promise<void> {
    try {
      await this.repository.update(product)
      return
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id)
      return
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

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
      console.error('Error finding related products:', error)
      throw error
    }
  }
}
