import { PaginationParams } from '../../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from '../../../types/common/db.type'
import { ProductsSortBy } from '../../../types/products/products-sort-by.type'
import { Products } from '../../../types/products/products.type'
import {
  ProductCreate,
  ProductUpdate,
  Product
} from '../../../types/products/product.schema'

/**
 * Products repository interface
 */
export interface IProductsRepository {
  getAll(
    sortByField?: ProductsSortBy,
    sortOrder?: FindOptionsOrderValue
  ): Promise<Products>

  getPaged(
    pagination: PaginationParams,
    sortByField?: ProductsSortBy,
    sortOrder?: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<Products>

  getById(id: string): Promise<Product | null>

  getByArtistId(artistId: string): Promise<Product[]>

  getFeaturedProducts(): Promise<Product[]>

  create(product: ProductCreate): Promise<Product>

  update(product: ProductUpdate): Promise<void>

  delete(id: string): Promise<void>

  findRelated(
    artworkId: string,
    category: string,
    artistId: string
  ): Promise<Product[]>
}
