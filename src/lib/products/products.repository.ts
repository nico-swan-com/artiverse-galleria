import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue, ILike } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { ProductEntity } from './model/products.entity'
import { ProductsSortBy } from '../../types/products/products-sort-by.type'
import { Products } from '../../types/products/products.type'
import {
  ProductCreate,
  ProductUpdate,
  Product
} from '../../types/products/product.schema'
import { getRepository } from '../database'

class ProductsRepository {
  async getAll(
    sortByField: ProductsSortBy = 'title',
    sortOrder: FindOptionsOrderValue = 'ASC'
  ): Promise<Products> {
    try {
      const repository = await getRepository(ProductEntity)
      const [products, total] = await repository.findAndCount({
        order: { [sortByField]: sortOrder },
        relations: ['artist']
      })
      if (!products.length) {
        console.warn('No products found in database')
      }

      return {
        products: products as Product[],
        total
      }
    } catch (error) {
      console.error('Error getting products', { error })
      throw error
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
            { title: ILike(`%${searchQuery}%`) },
            { description: ILike(`%${searchQuery}%`) },
            { category: ILike(`%${searchQuery}%`) }
          ]
        }
      : undefined
    try {
      const repository = await getRepository(ProductEntity)
      const [products, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortByField]: sortOrder },
        where: searchFilter?.where,
        relations: ['artist']
      })
      return {
        products: plainToInstance(ProductEntity, products) as Product[],
        total
      }
    } catch (error) {
      console.error('Error getting products:', error)
      throw error
    }
  }

  async getById(id: string): Promise<Product | null> {
    try {
      const repository = await getRepository(ProductEntity)
      const found = await repository.findOne({
        where: { id },
        relations: ['artist']
      })
      return found ? (plainToInstance(ProductEntity, found) as Product) : null
    } catch (error) {
      console.error('Error getting product by id:', error)
      throw error
    }
  }

  async getByArtistId(artistId: string): Promise<Product[]> {
    try {
      const repository = await getRepository(ProductEntity)
      const products = await repository.find({
        where: { artistId },
        relations: ['artist']
      })
      return products.map(
        (product) => plainToInstance(ProductEntity, product) as Product
      )
    } catch (error) {
      console.error('Error getting products by artist:', error)
      throw error
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const repository = await getRepository(ProductEntity)
      const found = await repository.find({
        where: { featured: true },
        relations: ['artist']
      })
      return found.length
        ? found.map(
            (product) => plainToInstance(ProductEntity, product) as Product
          )
        : []
    } catch (error) {
      console.error('Error getting featured products:', error)
      throw error
    }
  }

  async create(product: ProductCreate): Promise<Product> {
    try {
      const repository = await getRepository(ProductEntity)
      const created = await repository.save(product as Partial<ProductEntity>)
      return created as Product
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async update(product: ProductUpdate): Promise<void> {
    try {
      if (!product.id) throw new Error('Product ID is required for update')
      const repository = await getRepository(ProductEntity)
      await repository.update(product.id, product as Partial<ProductEntity>)
      return
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const repository = await getRepository(ProductEntity)
      await repository.delete(id)
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
      const repository = await getRepository(ProductEntity)
      const related = await repository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.artist', 'artist')
        .where('product.id != :artworkId', { artworkId })
        .andWhere(
          '(product.category = :category OR product.artistId = :artistId)',
          {
            category,
            artistId
          }
        )
        .orderBy('RANDOM()')
        .limit(4)
        .getMany()
      return related as Product[]
    } catch (error) {
      console.error('Error finding related products:', error)
      throw error
    }
  }
}

const productsRepository = new ProductsRepository()

export { ProductsRepository, productsRepository }
