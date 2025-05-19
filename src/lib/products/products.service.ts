import { PaginationParams } from '../../types/common/pagination-params.type'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from 'typeorm'
import { ProductsRepository } from './products.repository'
import { ProductsSortBy } from './model/products-sort-by.type'
import { Products } from './model/products.type'
import { Product, ProductCreate, ProductUpdate } from './model/product.schema'

export default class ProductsService {
  repository: ProductsRepository

  constructor() {
    this.repository = new ProductsRepository()
  }

  async getAll(
    sortBy: ProductsSortBy,
    order: FindOptionsOrderValue
  ): Promise<Products> {
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
}
