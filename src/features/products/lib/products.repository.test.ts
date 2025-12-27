import { ProductsRepository } from './products.repository'
import { db } from '@/lib/database/drizzle'
import * as Mappers from '@/lib/database/mappers/product.mapper'
import type {
  ProductCreate,
  ProductUpdate,
  Product
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

jest.mock('@/lib/utilities/search-query.util', () => ({
  validateSearchQuery: jest.fn((query) => query || undefined),
  buildSearchFilter: jest.fn((query, columns) => {
    if (!query) return undefined
    return { type: 'search', query, columns }
  })
}))

jest.mock('drizzle-orm', () => ({
  eq: jest.fn((column, value) => ({ type: 'eq', column, value })),
  and: jest.fn((...conditions) => ({ type: 'and', conditions })),
  or: jest.fn((...conditions) => ({ type: 'or', conditions })),
  ne: jest.fn((column, value) => ({ type: 'ne', column, value })),
  sql: jest.fn((strings, ...values) => ({
    type: 'sql',
    strings,
    values
  })),
  desc: jest.fn((column) => ({ type: 'desc', column })),
  asc: jest.fn((column) => ({ type: 'asc', column })),
  count: jest.fn(() => ({ type: 'count' }))
}))

jest.mock('@/lib/database/schema', () => ({
  products: {
    id: 'id',
    title: 'title',
    category: 'category',
    style: 'style',
    price: 'price',
    artistId: 'artistId',
    featured: 'featured'
  },
  artists: {
    id: 'id'
  }
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
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis()
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
    mockDbInfo = db as unknown as MockDatabase
  })

  describe('getAll', () => {
    it('should return mapped products with default sorting', async () => {
      const mockDbResult = [{ id: 'p1' }]
      const mockMappedResult: Product[] = [
        {
          id: 'p1',
          title: 'Product 1',
          description: 'Description',
          price: 100,
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'art',
          featured: false
        }
      ]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getAll()

      expect(result.products).toEqual(mockMappedResult)
      expect(result.total).toBe(1)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(mockDbInfo.query.products.findMany as jest.Mock).mockRejectedValue(
        error
      )

      await expect(repository.getAll()).rejects.toThrow('Database error')
    })
  })

  describe('getPaged', () => {
    it('should return paged products', async () => {
      const mockDbResult = [{ id: 'p1' }]
      const mockMappedResult: Product[] = [
        {
          id: 'p1',
          title: 'Product 1',
          description: 'Description',
          price: 100,
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'art',
          featured: false
        }
      ]
      const mockCountResult = [{ count: 10 }]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )

      // Mock the select chain for count
      const mockSelectCount = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult)
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelectCount)
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getPaged(
        { page: 1, limit: 10 },
        'title',
        'ASC'
      )

      expect(result.products).toEqual(mockMappedResult)
      expect(result.total).toBe(10)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should apply search filter', async () => {
      const mockDbResult: unknown[] = []
      const mockMappedResult: Product[] = []
      const mockCountResult = [{ count: 0 }]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      const mockSelectCount = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult)
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelectCount)
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getPaged(
        { page: 1, limit: 10 },
        'title',
        'ASC',
        { searchQuery: 'test' }
      )

      expect(result.products).toEqual(mockMappedResult)
      expect(result.total).toBe(0)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should apply category filter', async () => {
      const mockDbResult: unknown[] = []
      const mockMappedResult: Product[] = []
      const mockCountResult = [{ count: 0 }]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      const mockSelectCount = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult)
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelectCount)
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getPaged(
        { page: 1, limit: 10 },
        'title',
        'ASC',
        { category: 'painting' }
      )

      expect(result.products).toEqual(mockMappedResult)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should apply price range filters', async () => {
      const mockDbResult: unknown[] = []
      const mockMappedResult: Product[] = []
      const mockCountResult = [{ count: 0 }]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      const mockSelectCount = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockCountResult)
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelectCount)
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getPaged(
        { page: 2, limit: 20 },
        'price',
        'DESC',
        { minPrice: 10, maxPrice: 100 }
      )

      expect(result.products).toEqual(mockMappedResult)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(mockDbInfo.query.products.findMany as jest.Mock).mockRejectedValue(
        error
      )

      const mockSelectCount = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ count: 0 }])
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelectCount)

      await expect(
        repository.getPaged({ page: 1, limit: 10 }, 'title', 'ASC')
      ).rejects.toThrow('Database error')
    })
  })

  describe('getById', () => {
    it('should return mapped product if found', async () => {
      const mockDbResult = { id: 'p1' }
      const mockMappedResult: Product = {
        id: 'p1',
        title: 'Product 1',
        description: 'Description',
        price: 100,
        stock: 10,
        sales: 0,
        productType: 'physical',
        category: 'art',
        featured: false
      }

      ;(mockDbInfo.query.products.findFirst as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      ;(Mappers.mapProductWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getById('p1')

      expect(result).toEqual(mockMappedResult)
      expect(mockDbInfo.query.products.findFirst).toHaveBeenCalled()
    })

    it('should return null if not found', async () => {
      ;(mockDbInfo.query.products.findFirst as jest.Mock).mockResolvedValue(
        null
      )
      const result = await repository.getById('p1')
      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(mockDbInfo.query.products.findFirst as jest.Mock).mockRejectedValue(
        error
      )

      await expect(repository.getById('p1')).rejects.toThrow('Database error')
    })
  })

  describe('getByArtistId', () => {
    it('should return products by artist id', async () => {
      const mockDbResult = [{ id: 'p1', artistId: 'a1' }]
      const mockMappedResult: Product[] = [
        {
          id: 'p1',
          title: 'Product 1',
          artistId: 'a1',
          description: 'Description',
          price: 100,
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'art',
          featured: false
        }
      ]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getByArtistId('a1')

      expect(result).toEqual(mockMappedResult)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(mockDbInfo.query.products.findMany as jest.Mock).mockRejectedValue(
        error
      )

      await expect(repository.getByArtistId('a1')).rejects.toThrow(
        'Database error'
      )
    })
  })

  describe('getFeaturedProducts', () => {
    it('should return featured products', async () => {
      const mockDbResult = [{ id: 'p1', featured: true }]
      const mockMappedResult: Product[] = [
        {
          id: 'p1',
          title: 'Product 1',
          featured: true,
          description: 'Description',
          price: 100,
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'art'
        }
      ]

      ;(mockDbInfo.query.products.findMany as jest.Mock).mockResolvedValue(
        mockDbResult
      )
      ;(Mappers.mapProductsWithArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getFeaturedProducts()

      expect(result).toEqual(mockMappedResult)
      expect(mockDbInfo.query.products.findMany).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      ;(mockDbInfo.query.products.findMany as jest.Mock).mockRejectedValue(
        error
      )

      await expect(repository.getFeaturedProducts()).rejects.toThrow(
        'Database error'
      )
    })
  })

  describe('create', () => {
    it('should create and return mapped product', async () => {
      const input: ProductCreate = {
        title: 'New Product',
        description: 'Description',
        price: 100,
        stock: 10,
        sales: 0,
        category: 'Art',
        artistId: 'a1',
        productType: 'physical',
        featured: false
      }
      const inserted = { id: 'new', ...input, price: '100', sales: '0' }
      const mapped = { id: 'new', ...input }

      const mockInsert = createChainableMock()
      mockInsert.returning.mockResolvedValue([inserted])
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)
      ;(Mappers.mapProductToAppType as jest.Mock).mockReturnValue(mapped)

      const result = await repository.create(input)

      expect(result).toEqual(mapped)
      expect(db.insert).toHaveBeenCalled()
      expect(mockInsert.values).toHaveBeenCalled()
    })

    it('should handle optional fields', async () => {
      const input: ProductCreate = {
        title: 'New Product',
        description: 'Description',
        price: 50,
        stock: 5,
        sales: 0,
        category: 'Art',
        productType: 'physical',
        featured: false,
        yearCreated: 2023,
        medium: 'Oil',
        style: 'modern'
      }
      const inserted = { id: 'new', ...input, price: '50', sales: '0' }
      const mapped = { id: 'new', ...input }

      const mockInsert = createChainableMock()
      mockInsert.returning.mockResolvedValue([inserted])
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)
      ;(Mappers.mapProductToAppType as jest.Mock).mockReturnValue(mapped)

      await repository.create(input)

      expect(db.insert).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const input: ProductCreate = {
        title: 'New Product',
        description: 'Description',
        price: 100,
        stock: 10,
        sales: 0,
        category: 'Art',
        productType: 'physical',
        featured: false
      }
      const error = new Error('Database error')

      const mockInsert = createChainableMock()
      mockInsert.returning.mockRejectedValue(error)
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)

      await expect(repository.create(input)).rejects.toThrow('Database error')
    })
  })

  describe('update', () => {
    it('should update product', async () => {
      const updateData: ProductUpdate = { id: 'p1', title: 'Updated' }

      const mockUpdate = createChainableMock()
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await repository.update(updateData)

      expect(db.update).toHaveBeenCalled()
      expect(mockUpdate.set).toHaveBeenCalled()
      expect(mockUpdate.where).toHaveBeenCalled()
    })

    it('should convert price and sales to string', async () => {
      const updateData: ProductUpdate = {
        id: 'p1',
        price: 150.5,
        sales: 25.75
      }

      const mockUpdate = createChainableMock()
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await repository.update(updateData)

      expect(mockUpdate.set).toHaveBeenCalledWith(
        expect.objectContaining({
          price: '150.5',
          sales: '25.75',
          updatedAt: expect.any(Date)
        })
      )
    })

    it('should filter out undefined values', async () => {
      const updateData: ProductUpdate = {
        id: 'p1',
        title: 'Updated',
        price: undefined
      }

      const mockUpdate = createChainableMock()
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await repository.update(updateData)

      expect(mockUpdate.set).toHaveBeenCalledWith(
        expect.not.objectContaining({
          price: expect.anything()
        })
      )
    })

    it('should throw error if id is missing', async () => {
      const updateData = { title: 'Updated' } as ProductUpdate

      await expect(repository.update(updateData)).rejects.toThrow(
        'Product ID is required'
      )
    })

    it('should handle errors', async () => {
      const updateData: ProductUpdate = { id: 'p1', title: 'Updated' }
      const error = new Error('Database error')

      const mockUpdate = createChainableMock()
      mockUpdate.where.mockRejectedValue(error)
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await expect(repository.update(updateData)).rejects.toThrow(
        'Database error'
      )
    })
  })

  describe('delete', () => {
    it('should delete product', async () => {
      const mockDelete = createChainableMock()
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      await repository.delete('p1')

      expect(db.delete).toHaveBeenCalled()
      expect(mockDelete.where).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockDelete = createChainableMock()
      mockDelete.where.mockRejectedValue(error)
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      await expect(repository.delete('p1')).rejects.toThrow('Database error')
    })
  })

  describe('findRelated', () => {
    it('should find related products', async () => {
      const mockResult = [
        { products: { id: 'p2' }, artists: { id: 'a1' } },
        { products: { id: 'p3' }, artists: null }
      ]
      const mockMappedProducts = [
        { id: 'p2', title: 'Product 2' },
        { id: 'p3', title: 'Product 3' }
      ]

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockResult)
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelect)
      ;(Mappers.mapProductToAppType as jest.Mock)
        .mockReturnValueOnce(mockMappedProducts[0])
        .mockReturnValueOnce(mockMappedProducts[1])

      const result = await repository.findRelated('p1', 'painting', 'a1')

      expect(result).toHaveLength(2)
      expect(db.select).toHaveBeenCalled()
      expect(mockSelect.from).toHaveBeenCalled()
      expect(mockSelect.where).toHaveBeenCalled()
      expect(mockSelect.limit).toHaveBeenCalledWith(4)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(error)
      }
      ;(db.select as jest.Mock).mockReturnValue(mockSelect)

      await expect(
        repository.findRelated('p1', 'painting', 'a1')
      ).rejects.toThrow('Database error')
    })
  })

  describe('getCategories', () => {
    it('should return categories', async () => {
      const mockResult = [
        { category: 'painting' },
        { category: 'sculpture' },
        { category: null }
      ]

      const mockSelectDistinct = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockResult)
      }
      ;(db.selectDistinct as jest.Mock).mockReturnValue(mockSelectDistinct)

      const result = await repository.getCategories()

      expect(result).toEqual(['painting', 'sculpture'])
      expect(db.selectDistinct).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockSelectDistinct = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockRejectedValue(error)
      }
      ;(db.selectDistinct as jest.Mock).mockReturnValue(mockSelectDistinct)

      await expect(repository.getCategories()).rejects.toThrow('Database error')
    })
  })

  describe('getStyles', () => {
    it('should return styles', async () => {
      const mockResult = [
        { style: 'modern' },
        { style: 'abstract' },
        { style: null }
      ]

      const mockSelectDistinct = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockResult)
      }
      ;(db.selectDistinct as jest.Mock).mockReturnValue(mockSelectDistinct)

      const result = await repository.getStyles()

      expect(result).toEqual(['modern', 'abstract'])
      expect(db.selectDistinct).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockSelectDistinct = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockRejectedValue(error)
      }
      ;(db.selectDistinct as jest.Mock).mockReturnValue(mockSelectDistinct)

      await expect(repository.getStyles()).rejects.toThrow('Database error')
    })
  })
})
