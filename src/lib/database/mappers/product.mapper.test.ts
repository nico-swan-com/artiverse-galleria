import {
  mapProductToAppType,
  mapProductWithArtistToAppType,
  mapProductsToAppType,
  mapProductsWithArtistToAppType
} from './product.mapper'
import type { InferSelectModel } from 'drizzle-orm'
import { products, artists } from '../schema'

// Type for Drizzle product result
type DrizzleProduct = InferSelectModel<typeof products>

// Type for Drizzle product with artist relation
type ProductWithArtist = DrizzleProduct & {
  artist: InferSelectModel<typeof artists> | null
}

describe('Product Mapper', () => {
  describe('mapProductToAppType', () => {
    it('should map product with all fields', () => {
      const drizzleProduct: DrizzleProduct = {
        id: 'product-1',
        sku: 123,
        title: 'Test Product',
        description: 'Test Description',
        price: '100.50',
        stock: 10,
        sales: '5.00',
        featured: true,
        productType: 'physical',
        category: 'painting',
        artistId: 'artist-1',
        yearCreated: 2023,
        medium: 'Oil',
        dimensions: '30x40',
        weight: '2kg',
        style: 'modern',
        featureImage: 'image.jpg',
        images: ['img1.jpg', 'img2.jpg'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        deletedAt: null
      } as DrizzleProduct

      const result = mapProductToAppType(drizzleProduct)

      expect(result.id).toBe('product-1')
      expect(result.sku).toBe(123)
      expect(result.title).toBe('Test Product')
      expect(result.price).toBe(100.5) // Decimal converted to number
      expect(result.stock).toBe(10) // Integer stays as number
      expect(result.sales).toBe(5) // Decimal converted to number
      expect(result.yearCreated).toBe(2023)
      expect(result.medium).toBe('Oil')
      expect(result.dimensions).toBe('30x40')
      expect(result.weight).toBe('2kg')
      expect(result.style).toBe('modern')
      expect(result.featureImage).toBe('image.jpg')
      expect(result.images).toEqual(['img1.jpg', 'img2.jpg'])
      expect(result.artistId).toBe('artist-1')
      expect(
        (result as typeof result & { deletedAt?: Date }).deletedAt
      ).toBeUndefined() // null converted to undefined
    })

    it('should convert null optional fields to undefined', () => {
      const drizzleProduct: DrizzleProduct = {
        id: 'product-1',
        sku: 123,
        title: 'Test Product',
        description: 'Test Description',
        price: '100.00',
        stock: 10,
        sales: '0.00',
        featured: false,
        productType: 'physical',
        category: 'sculpture',
        artistId: null,
        yearCreated: null,
        medium: null,
        dimensions: null,
        weight: null,
        style: null,
        featureImage: null,
        images: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      } as DrizzleProduct

      const result = mapProductToAppType(drizzleProduct)

      expect(result.yearCreated).toBeUndefined()
      expect(result.medium).toBeUndefined()
      expect(result.dimensions).toBeUndefined()
      expect(result.weight).toBeUndefined()
      expect(result.style).toBeUndefined()
      expect(result.featureImage).toBeUndefined()
      expect(result.images).toBeUndefined()
      expect(result.artistId).toBeUndefined()
      expect(
        (result as typeof result & { deletedAt?: Date }).deletedAt
      ).toBeUndefined()
    })

    it('should convert decimal price to number', () => {
      const drizzleProduct: DrizzleProduct = {
        id: 'product-1',
        sku: 123,
        title: 'Test',
        description: 'Test',
        price: '99.99',
        stock: 10,
        sales: '0.00',
        featured: false,
        productType: 'physical',
        category: 'painting',
        createdAt: new Date(),
        updatedAt: new Date()
      } as DrizzleProduct

      const result = mapProductToAppType(drizzleProduct)

      expect(typeof result.price).toBe('number')
      expect(result.price).toBe(99.99)
    })

    it('should convert decimal sales to number', () => {
      const drizzleProduct: DrizzleProduct = {
        id: 'product-1',
        sku: 123,
        title: 'Test',
        description: 'Test',
        price: '100.00',
        stock: 10,
        sales: '250.75',
        featured: false,
        productType: 'physical',
        category: 'painting',
        createdAt: new Date(),
        updatedAt: new Date()
      } as DrizzleProduct

      const result = mapProductToAppType(drizzleProduct)

      expect(typeof result.sales).toBe('number')
      expect(result.sales).toBe(250.75)
    })

    it('should preserve all non-nullable fields', () => {
      const drizzleProduct: DrizzleProduct = {
        id: 'product-1',
        sku: 456,
        title: 'Another Product',
        description: 'Another Description',
        price: '200.00',
        stock: 20,
        sales: '10.00',
        featured: true,
        productType: 'digital',
        category: 'drawing',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        deletedAt: null
      } as DrizzleProduct

      const result = mapProductToAppType(drizzleProduct)

      expect(result.id).toBe('product-1')
      expect(result.sku).toBe(456)
      expect(result.title).toBe('Another Product')
      expect(result.description).toBe('Another Description')
      expect(result.featured).toBe(true)
      expect(result.productType).toBe('digital')
      expect(result.category).toBe('drawing')
      expect(result.createdAt).toEqual(new Date('2024-01-01'))
      expect(result.updatedAt).toEqual(new Date('2024-01-02'))
    })
  })

  describe('mapProductWithArtistToAppType', () => {
    it('should map product with artist', () => {
      const drizzleProduct: ProductWithArtist = {
        id: 'product-1',
        sku: 123,
        title: 'Test Product',
        description: 'Test Description',
        price: '100.00',
        stock: 10,
        sales: '0.00',
        featured: false,
        productType: 'physical',
        category: 'painting',
        featureImage: null,
        images: null,
        artistId: null,
        yearCreated: null,
        medium: null,
        dimensions: null,
        weight: null,
        style: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        artist: {
          id: 'artist-1',
          name: 'Test Artist',
          image: 'artist.jpg',
          featured: true,
          styles: ['modern'],
          biography: 'Bio',
          specialization: 'Painting',
          location: 'New York',
          email: 'artist@test.com',
          website: null,
          exhibitions: [],
          statement: 'Statement',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        }
      } as ProductWithArtist

      const result = mapProductWithArtistToAppType(drizzleProduct)

      expect(result.id).toBe('product-1')
      const resultWithArtist = result as typeof result & {
        artist?: { id: string; name: string }
      }
      expect(resultWithArtist.artist).toBeDefined()
      expect(resultWithArtist.artist?.id).toBe('artist-1')
      expect(resultWithArtist.artist?.name).toBe('Test Artist')
    })

    it('should map product with null artist to undefined', () => {
      const drizzleProduct: ProductWithArtist = {
        id: 'product-1',
        sku: 123,
        title: 'Test Product',
        description: 'Test Description',
        price: '100.00',
        stock: 10,
        sales: '0.00',
        featured: false,
        productType: 'physical',
        category: 'painting',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        artist: null
      } as ProductWithArtist

      const result = mapProductWithArtistToAppType(drizzleProduct)

      const resultWithArtist = result as typeof result & { artist?: unknown }
      expect(resultWithArtist.artist).toBeUndefined()
    })

    it('should use mapProductToAppType and add artist', () => {
      const drizzleProduct: ProductWithArtist = {
        id: 'product-1',
        sku: 123,
        title: 'Test',
        description: 'Test',
        price: '50.00',
        stock: 5,
        sales: '0.00',
        featured: false,
        productType: 'physical',
        category: 'sculpture',
        featureImage: null,
        images: null,
        artistId: null,
        yearCreated: null,
        medium: null,
        dimensions: null,
        weight: null,
        style: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        artist: {
          id: 'artist-2',
          name: 'Artist Two',
          image: 'img.jpg',
          featured: false,
          styles: [],
          biography: 'Bio',
          specialization: 'Sculpture',
          location: 'Paris',
          email: 'artist2@test.com',
          website: null,
          exhibitions: [],
          statement: 'Statement',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        }
      } as ProductWithArtist

      const result = mapProductWithArtistToAppType(drizzleProduct)

      // Verify product fields are mapped correctly
      expect(result.price).toBe(50) // Decimal converted
      expect(result.stock).toBe(5)
      // Verify artist is included
      const resultWithArtist = result as typeof result & {
        artist?: { id: string }
      }
      expect(resultWithArtist.artist).toBeDefined()
      expect(resultWithArtist.artist?.id).toBe('artist-2')
    })
  })

  describe('mapProductsToAppType', () => {
    it('should map array of products', () => {
      const drizzleProducts: DrizzleProduct[] = [
        {
          id: 'product-1',
          sku: 123,
          title: 'Product 1',
          description: 'Desc 1',
          price: '100.00',
          stock: 10,
          sales: '0.00',
          featured: false,
          productType: 'physical',
          category: 'painting',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        },
        {
          id: 'product-2',
          sku: 456,
          title: 'Product 2',
          description: 'Desc 2',
          price: '200.00',
          stock: 20,
          sales: '5.00',
          featured: true,
          productType: 'digital',
          category: 'drawing',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        }
      ] as DrizzleProduct[]

      const result = mapProductsToAppType(drizzleProducts)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe('product-1')
      expect(result[0]?.price).toBe(100)
      expect(result[1]?.id).toBe('product-2')
      expect(result[1]?.price).toBe(200)
      expect(result[1]?.sales).toBe(5)
    })

    it('should return empty array for empty input', () => {
      const result = mapProductsToAppType([])
      expect(result).toEqual([])
    })
  })

  describe('mapProductsWithArtistToAppType', () => {
    it('should map array of products with artists', () => {
      const drizzleProducts: ProductWithArtist[] = [
        {
          id: 'product-1',
          sku: 123,
          title: 'Product 1',
          description: 'Desc 1',
          price: '100.00',
          stock: 10,
          sales: '0.00',
          featured: false,
          productType: 'physical',
          category: 'painting',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          artist: {
            id: 'artist-1',
            name: 'Artist 1',
            image: 'img1.jpg',
            featured: false,
            styles: [],
            biography: 'Bio',
            specialization: 'Painting',
            location: 'NYC',
            email: 'a1@test.com',
            website: null,
            exhibitions: [],
            statement: 'Statement',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
          }
        },
        {
          id: 'product-2',
          sku: 456,
          title: 'Product 2',
          description: 'Desc 2',
          price: '200.00',
          stock: 20,
          sales: '0.00',
          featured: false,
          productType: 'physical',
          category: 'painting',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          artist: null
        }
      ] as ProductWithArtist[]

      const result = mapProductsWithArtistToAppType(drizzleProducts)

      expect(result).toHaveLength(2)
      const result0WithArtist = result[0] as (typeof result)[0] & {
        artist?: { name: string }
      }
      const result1WithArtist = result[1] as (typeof result)[1] & {
        artist?: unknown
      }
      expect(result0WithArtist.artist).toBeDefined()
      expect(result0WithArtist.artist?.name).toBe('Artist 1')
      expect(result1WithArtist.artist).toBeUndefined()
    })

    it('should return empty array for empty input', () => {
      const result = mapProductsWithArtistToAppType([])
      expect(result).toEqual([])
    })
  })
})
