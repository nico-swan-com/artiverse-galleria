import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue, ILike } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { ProductsEntity } from './model/products.entity'
import { ProductsSortBy } from './model/products-sort-by.type'
import { Products } from './model/products.type'
import { Product, ProductCreate, ProductUpdate } from './model/product.schema'
import { getRepository } from '../database'
import { encodeImageBufferToDataUrl } from '../utilities'
class ProductsRepository {
  async getAll(
    sortByField: ProductsSortBy = 'name',
    sortOrder: FindOptionsOrderValue = 'ASC'
  ): Promise<Products> {
    try {
      const repository = await getRepository(ProductsEntity)
      const [products, total] = await repository.findAndCount({
        order: { [sortByField]: sortOrder }
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
            { name: ILike(`%${searchQuery}%`) },
            { description: ILike(`%${searchQuery}%`) },
            { category: ILike(`%${searchQuery}%`) }
          ]
        }
      : undefined
    try {
      const repository = await getRepository(ProductsEntity)
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
      const repository = await getRepository(ProductsEntity)
      const found = await repository.findOne({ where: { id } })
      return found ? (plainToInstance(ProductsEntity, found) as Product) : null
    } catch (error) {
      console.error('Error getting product by id:', error)
      return null
    }
  }

  async create(product: ProductCreate): Promise<Product> {
    try {
      const repository = await getRepository(ProductsEntity)
      if (product.image instanceof File) {
        const arrayBuffer = await product.image.arrayBuffer()
        product.image = Buffer.from<ArrayBuffer>(arrayBuffer)
      } else if (product.image instanceof ArrayBuffer) {
        product.image = Buffer.from(product.image)
      }
      if (Array.isArray(product.images)) {
        product.images = await Promise.all(
          product.images.map(async (img) => {
            if (img instanceof File) {
              const arrayBuffer = await img.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              return encodeImageBufferToDataUrl(buffer)
            } else if (img instanceof ArrayBuffer) {
              const buffer = Buffer.from(img)
              return encodeImageBufferToDataUrl(buffer)
            }
            return img
          })
        )
      }
      // Ensure all new fields are included in the save
      const created = await repository.save(product as Partial<ProductsEntity>)
      return created as Product
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async update(product: ProductUpdate): Promise<void> {
    try {
      if (!product.id) throw new Error('Product ID is required for update')
      if (product.image instanceof File) {
        const arrayBuffer = await product.image.arrayBuffer()
        product.image = Buffer.from<ArrayBuffer>(arrayBuffer)
      } else if (product.image instanceof ArrayBuffer) {
        product.image = Buffer.from(product.image)
      }
      if (Array.isArray(product.images)) {
        product.images = await Promise.all(
          product.images.map(async (img) => {
            if (img instanceof File) {
              const arrayBuffer = await img.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)
              return encodeImageBufferToDataUrl(buffer)
            } else if (img instanceof ArrayBuffer) {
              const buffer = Buffer.from(img)
              return encodeImageBufferToDataUrl(buffer)
            }
            return img
          })
        )
      }
      const repository = await getRepository(ProductsEntity)
      await repository.update(product.id, product as Partial<ProductsEntity>)
      return
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const repository = await getRepository(ProductsEntity)
      await repository.delete(id)
      return
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

export { ProductsRepository }
