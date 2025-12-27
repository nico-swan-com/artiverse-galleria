/* eslint-disable @typescript-eslint/no-require-imports */
import ProductsService from './products.service'
import { ProductsRepository } from './products.repository'
import { ProductCreate, ProductUpdate } from '@/types/products/product.schema'

// Mock dependencies
jest.mock('./products.repository')
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn)
}))
jest.mock('@/lib/utilities/build-phase.util', () => ({
  isBuildPhase: jest.fn(() => false)
}))
jest.mock('@/lib/cache/cache-tag.util', () => ({
  CacheTagGenerator: {
    products: jest.fn(() => 'tag-products'),
    productsPaged: jest.fn(() => 'tag-products-paged'),
    product: jest.fn((id) => `tag-product-${id}`),
    featuredProducts: jest.fn(() => 'tag-featured'),
    productsByArtist: jest.fn((id) => `tag-artist-${id}`),
    categories: jest.fn(() => 'tag-categories'),
    styles: jest.fn(() => 'tag-styles')
  }
}))
jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))
jest.mock('@/shared/constants', () => ({
  CACHE_CONFIG: {
    TAGS: {
      PRODUCTS: 'products'
    },
    DEFAULT_REVALIDATE: 3600,
    SHORT_REVALIDATE: 60,
    LONG_CACHE_DURATION: 86400
  }
}))

describe('ProductsService', () => {
  let service: ProductsService
  let mockRepository: jest.Mocked<ProductsRepository>

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository = {
      getAll: jest.fn(),
      getPaged: jest.fn(),
      getById: jest.fn(),
      getFeaturedProducts: jest.fn(),
      getByArtistId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findRelated: jest.fn(),
      getCategories: jest.fn(),
      getStyles: jest.fn()
    } as unknown as jest.Mocked<ProductsRepository>
    service = new ProductsService(mockRepository)
  })

  describe('getAll', () => {
    it('should return all products with caching', async () => {
      const mockProducts = {
        products: [
          {
            id: '1',
            title: 'Product 1',
            description: 'Description',
            price: 100,
            stock: 10,
            sales: 0,
            productType: 'physical',
            category: 'art',
            featured: false
          }
        ],
        total: 1
      }
      mockRepository.getAll.mockResolvedValue(mockProducts)

      const result = await service.getAll('title', 'ASC')

      expect(result).toEqual(mockProducts)
      expect(mockRepository.getAll).toHaveBeenCalledWith('title', 'ASC')
    })

    it('should return empty result during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getAll('title', 'ASC')

      expect(result).toEqual({ products: [], total: 0 })
      expect(mockRepository.getAll).not.toHaveBeenCalled()
    })
  })

  describe('getPaged', () => {
    it('should return paged products with caching', async () => {
      const mockProducts = {
        products: [
          {
            id: '1',
            title: 'Product 1',
            description: 'Description',
            price: 100,
            stock: 10,
            sales: 0,
            productType: 'physical',
            category: 'art',
            featured: false
          }
        ],
        total: 1
      }
      mockRepository.getPaged.mockResolvedValue(mockProducts)

      const result = await service.getPaged(
        { page: 1, limit: 10 },
        'title',
        'ASC',
        { category: 'painting' }
      )

      expect(result).toEqual(mockProducts)
      expect(mockRepository.getPaged).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        'title',
        'ASC',
        { category: 'painting' }
      )
    })

    it('should return empty result during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getPaged(
        { page: 1, limit: 10 },
        'title',
        'ASC'
      )

      expect(result).toEqual({ products: [], total: 0 })
      expect(mockRepository.getPaged).not.toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('should return product by id with caching', async () => {
      const mockProduct = {
        id: '1',
        title: 'Product 1',
        description: 'Description',
        price: 100,
        stock: 10,
        sales: 0,
        productType: 'physical',
        category: 'art',
        featured: false
      }
      mockRepository.getById.mockResolvedValue(mockProduct)

      const result = await service.getById('1')

      expect(result).toEqual(mockProduct)
      expect(mockRepository.getById).toHaveBeenCalledWith('1')
    })

    it('should return null if not found', async () => {
      mockRepository.getById.mockResolvedValue(null)

      const result = await service.getById('1')

      expect(result).toBeNull()
    })

    it('should return null during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getById('1')

      expect(result).toBeNull()
      expect(mockRepository.getById).not.toHaveBeenCalled()
    })
  })

  describe('getFeaturedProducts', () => {
    it('should return featured products with caching', async () => {
      const mockProducts = [
        {
          id: '1',
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
      mockRepository.getFeaturedProducts.mockResolvedValue(mockProducts)

      const result = await service.getFeaturedProducts()

      expect(result).toEqual(mockProducts)
      expect(mockRepository.getFeaturedProducts).toHaveBeenCalled()
    })

    it('should return empty array on error', async () => {
      const error = new Error('Database error')
      mockRepository.getFeaturedProducts.mockRejectedValue(error)

      const result = await service.getFeaturedProducts()

      expect(result).toEqual([])
    })

    it('should return empty array during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getFeaturedProducts()

      expect(result).toEqual([])
      expect(mockRepository.getFeaturedProducts).not.toHaveBeenCalled()
    })
  })

  describe('getByArtistId', () => {
    it('should return products by artist id with caching', async () => {
      const mockProducts = [
        {
          id: '1',
          title: 'Product 1',
          artistId: 'artist1',
          description: 'Description',
          price: 100,
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'art',
          featured: false
        }
      ]
      mockRepository.getByArtistId.mockResolvedValue(mockProducts)

      const result = await service.getByArtistId('artist1')

      expect(result).toEqual(mockProducts)
      expect(mockRepository.getByArtistId).toHaveBeenCalledWith('artist1')
    })

    it('should return empty array during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getByArtistId('artist1')

      expect(result).toEqual([])
      expect(mockRepository.getByArtistId).not.toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create a product', async () => {
      const productData: ProductCreate = {
        title: 'New Product',
        price: 100,
        description: 'Description',
        stock: 10,
        sales: 0,
        productType: 'physical',
        category: 'painting',
        featured: false
      }
      const mockProduct = { id: '1', ...productData }
      mockRepository.create.mockResolvedValue(mockProduct)

      const result = await service.create(productData)

      expect(result).toEqual(mockProduct)
      expect(mockRepository.create).toHaveBeenCalledWith(productData)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockRepository.create.mockRejectedValue(error)

      await expect(
        service.create({
          title: 'New Product',
          price: 100,
          description: 'Description',
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'painting',
          featured: false
        })
      ).rejects.toThrow('Database error')
    })
  })

  describe('update', () => {
    it('should update a product', async () => {
      const productData: ProductUpdate = {
        id: '1',
        title: 'Updated Product'
      }
      mockRepository.update.mockResolvedValue(undefined)

      await service.update(productData)

      expect(mockRepository.update).toHaveBeenCalledWith(productData)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockRepository.update.mockRejectedValue(error)

      await expect(
        service.update({ id: '1', title: 'Updated' })
      ).rejects.toThrow('Database error')
    })
  })

  describe('delete', () => {
    it('should delete a product', async () => {
      mockRepository.delete.mockResolvedValue(undefined)

      await service.delete('1')

      expect(mockRepository.delete).toHaveBeenCalledWith('1')
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockRepository.delete.mockRejectedValue(error)

      await expect(service.delete('1')).rejects.toThrow('Database error')
    })
  })

  describe('findRelated', () => {
    it('should find related products', async () => {
      const mockProducts = [
        {
          id: '2',
          title: 'Related Product',
          description: 'Description',
          price: 100,
          stock: 10,
          sales: 0,
          productType: 'physical',
          category: 'painting',
          featured: false
        }
      ]
      mockRepository.findRelated.mockResolvedValue(mockProducts)

      const result = await service.findRelated('1', 'painting', 'artist1')

      expect(result).toEqual(mockProducts)
      expect(mockRepository.findRelated).toHaveBeenCalledWith(
        '1',
        'painting',
        'artist1'
      )
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockRepository.findRelated.mockRejectedValue(error)

      await expect(
        service.findRelated('1', 'painting', 'artist1')
      ).rejects.toThrow('Database error')
    })
  })

  describe('getCategories', () => {
    it('should return categories with caching', async () => {
      const mockCategories = ['painting', 'sculpture']
      mockRepository.getCategories.mockResolvedValue(mockCategories)

      const result = await service.getCategories()

      expect(result).toEqual(mockCategories)
      expect(mockRepository.getCategories).toHaveBeenCalled()
    })

    it('should return empty array during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getCategories()

      expect(result).toEqual([])
      expect(mockRepository.getCategories).not.toHaveBeenCalled()
    })
  })

  describe('getStyles', () => {
    it('should return styles with caching', async () => {
      const mockStyles = ['modern', 'abstract']
      mockRepository.getStyles.mockResolvedValue(mockStyles)

      const result = await service.getStyles()

      expect(result).toEqual(mockStyles)
      expect(mockRepository.getStyles).toHaveBeenCalled()
    })

    it('should return empty array during build phase', async () => {
      const { isBuildPhase } = require('@/lib/utilities/build-phase.util')
      ;(isBuildPhase as jest.Mock).mockReturnValueOnce(true)

      const result = await service.getStyles()

      expect(result).toEqual([])
      expect(mockRepository.getStyles).not.toHaveBeenCalled()
    })
  })
})
