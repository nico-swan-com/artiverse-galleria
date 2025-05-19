import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue, ILike, Repository } from 'typeorm'
import { DatabaseRepository } from '../data-access'
import { plainToInstance } from 'class-transformer'
import { ProductsEntity } from './model/products.entity'
import { ProductsSortBy } from './model/products-sort-by.type'
import { Products } from './model/products.type'
import { Product, ProductCreate, ProductUpdate } from './model/product.schema'

@DatabaseRepository(ProductsEntity, 'repository')
class ProductsRepository {
  /**
   * Injected by `@DatabaseRepository`.
   * The decorator returns a Promise that resolves to the actual repository.
   */
  private repository!: Repository<ProductsEntity>

  async getAll(
    sortByField: ProductsSortBy = 'createdAt',
    sortOrder: FindOptionsOrderValue = 'ASC'
  ): Promise<Products> {
    try {
      const repository = await this.repository

      // Add debug logging to verify we're getting to this point
      console.debug('Fetching all products', { sortByField, sortOrder })

      const [products, total] = await repository.findAndCount({
        order: { [sortByField]: sortOrder },
        // Explicitly select all columns to ensure we're getting all data
        select: [
          'id',
          'name',
          'description',
          'price',
          'category',
          'createdAt',
          'updatedAt'
        ]
      })

      // Add debug logging for the results
      console.debug('Products fetched', { count: products.length, total })

      if (!products.length) {
        console.warn('No products found in database')
      }

      return {
        products: plainToInstance(ProductsEntity, products) as Product[],
        total
      }
    } catch (error) {
      console.error('Error getting products', { error })
      throw error // Let the service layer handle the error instead of returning empty
    }
  }

  async getPaged(
    pagination: PaginationParams,
    sortByField: ProductsSortBy = 'createdAt',
    sortOrder: FindOptionsOrderValue = 'DESC',
    searchQuery?: string
  ): Promise<Products> {
    const { page, limit } = pagination
    const skip = (page - 1) * limit
    const searchFilter = searchQuery
      ? {
          where: [
            { name: ILike(`%${searchQuery}%`) },
            { description: ILike(`%${searchQuery}%`) },
            { category: ILike(`%${searchQuery}%`) }
          ]
        }
      : undefined
    try {
      const repository = await this.repository
      const [products, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortByField]: sortOrder },
        where: searchFilter?.where
      })
      return {
        products: plainToInstance(ProductsEntity, products) as Product[],
        total
      }
    } catch (error) {
      console.error('Error getting products:', error)
      return { products: [], total: 0 }
    }
  }

  async getById(id: string): Promise<Product | null> {
    try {
      const repository = await this.repository
      const found = await repository.findOne({ where: { id } })
      return found ? (plainToInstance(ProductsEntity, found) as Product) : null
    } catch (error) {
      console.error('Error getting product by id:', error)
      return null
    }
  }

  async create(product: ProductCreate): Promise<Product> {
    try {
      const repository = await this.repository
      const created = await repository.save(product)
      return created as Product
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async update(product: ProductUpdate): Promise<void> {
    try {
      if (!product.id) throw new Error('Product ID is required for update')
      console.log('Updating product:', product)
      const repository = await this.repository
      await repository.update(product.id, product)
      return
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const repository = await this.repository
      await repository.delete(id)
      return
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

export { ProductsRepository }
