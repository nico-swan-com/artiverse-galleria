import { PaginationParams } from '../../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from '../../../types/common/db.type'

/**
 * Base repository interface
 * Defines common CRUD operations
 */
export interface IBaseRepository<T, TCreate, TUpdate> {
  /**
   * Get all entities
   */
  getAll(): Promise<T[]>

  /**
   * Get entity by ID
   */
  getById(id: string): Promise<T | null>

  /**
   * Create a new entity
   */
  create(entity: TCreate): Promise<T>

  /**
   * Update an existing entity
   */
  update(entity: TUpdate & { id: string }): Promise<void>

  /**
   * Delete an entity by ID
   */
  delete(id: string): Promise<void>
}

/**
 * Paginated repository interface
 * Extends base repository with pagination support
 */
export interface IPaginatedRepository<
  T,
  TCreate,
  TUpdate
> extends IBaseRepository<T, TCreate, TUpdate> {
  /**
   * Get paginated results
   */
  getPaged(
    pagination: PaginationParams,
    sortBy: string,
    order: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<{ items: T[]; total: number }>
}
