import { ProductsRepository } from './products.repository'
import { db } from '@/lib/database/drizzle'
import * as Mappers from '@/lib/database/mappers/product.mapper'
import type {
  ProductCreate,
  ProductUpdate
} from '@/types/products/product.schema'

// Mock dependencies
jest.mock('@/lib/database/drizzle', () => ({
  db: {
    query: {
      products: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
    selectDistinct: jest.fn()
  }
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

jest.mock('@/lib/database/mappers/product.mapper', () => ({
  mapProductsWithArtistToAppType: jest.fn(),
  mapProductWithArtistToAppType: jest.fn(),
  mapProductToAppType: jest.fn()
}))

// Helper to create a chainable mock object
const createChainableMock = () => {
  const mock = {
    from: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis()
  }
  return mock
}

type MockDatabase = typeof db

describe('ProductsRepository', () => {
  let repository: ProductsRepository
  let mockDbInfo: MockDatabase

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new ProductsRepository()
    mockDbInfo = db
  })

  describe('getAll', () => {
    it('should return mapped products', async () => {
      const mockDbResult = [{ id: 'p1' }]
      const mockMappedResult = [{ id: 'p1', title: 'Product 1' }]

      mockDbInfo.query.products.findMany.mockResolvedValue(mockDbResult)
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getAll()

      expect(result.products).toEqual(mockMappedResult)
      expect(result.total).toBe(1)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('should return mapped product if found', async () => {
      const mockDbResult = { id: 'p1' }
      const mockMappedResult = { id: 'p1', title: 'Product 1' }

      mockDbInfo.query.products.findFirst.mockResolvedValue(mockDbResult)
      ;(Mappers.mapProductWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getById('p1')

      expect(result).toEqual(mockMappedResult)
    })

    it('should return null if not found', async () => {
      mockDbInfo.query.products.findFirst.mockResolvedValue(null)
      const result = await repository.getById('p1')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return mapped product', async () => {
      const input = {
        title: 'New Product',
        price: 100,
        stock: 10,
        sales: 0,
        category: 'Art',
        artistId: 'a1'
      } // Partial input
      const inserted = { id: 'new', ...input }
      const mapped = { id: 'new', ...input }

      const mockInsert = createChainableMock()
      mockInsert.returning.mockResolvedValue([inserted])
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)
      ;(Mappers.mapProductToAppType as jest.Mock).mockReturnValue(mapped)

      const result = await repository.create(input as ProductCreate)

      expect(result).toEqual(mapped)
      expect(db.insert).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update product', async () => {
      const updateData = { id: 'p1', title: 'Updated' }

      const mockUpdate = createChainableMock()
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await repository.update(updateData as ProductUpdate)

      expect(db.update).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete product', async () => {
      const mockDelete = createChainableMock()
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      await repository.delete('p1')
      expect(db.delete).toHaveBeenCalled()
    })
  })
})
