import { MediaRepository } from './media.repository'
import { db } from '@/lib/database/drizzle'
import { media } from '@/lib/database/schema'
import type { MockDatabase } from '@/__tests__/utils/mock-types.helper'

// Mock dependencies
jest.mock('@/lib/database/drizzle', () => ({
  db: {
    query: {
      media: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}))

jest.mock('@/lib/database/schema', () => ({
  media: {
    id: 'id',
    fileName: 'fileName',
    contentHash: 'contentHash',
    tags: 'tags'
  }
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

jest.mock('drizzle-orm', () => ({
  eq: jest.fn((column, value) => ({ column, value })),
  and: jest.fn((...conditions) => conditions),
  arrayContains: jest.fn((column, value) => ({ column, value }))
}))

describe('MediaRepository', () => {
  let repository: MediaRepository
  let mockDb: MockDatabase

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new MediaRepository()
    mockDb = db as unknown as MockDatabase
  })

  describe('getAll', () => {
    it('should return all media', async () => {
      const mockMedia = [
        {
          id: '1',
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024
        }
      ]
      mockDb.query.media.findMany.mockResolvedValue(mockMedia)

      const result = await repository.getAll()

      expect(result).toEqual(mockMedia)
      expect(mockDb.query.media.findMany).toHaveBeenCalledWith({
        columns: {
          id: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
          altText: true,
          contentHash: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
      })
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockDb.query.media.findMany.mockRejectedValue(error)

      await expect(repository.getAll()).rejects.toThrow('Database error')
    })
  })

  describe('getById', () => {
    it('should return media by id', async () => {
      const mockMedia = {
        id: '1',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg'
      }
      mockDb.query.media.findFirst.mockResolvedValue(mockMedia)

      const result = await repository.getById('1')

      expect(result).toEqual(mockMedia)
    })

    it('should return null if not found', async () => {
      mockDb.query.media.findFirst.mockResolvedValue(null)

      const result = await repository.getById('1')

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockDb.query.media.findFirst.mockRejectedValue(error)

      await expect(repository.getById('1')).rejects.toThrow('Database error')
    })
  })

  describe('createAndSave', () => {
    it('should create and save media', async () => {
      const mockMediaData = {
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024,
        data: Buffer.from('test')
      }
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: '1', ...mockMediaData }])
      }
      mockDb.insert.mockReturnValue(mockInsert)

      const result = await repository.createAndSave(mockMediaData)

      expect(result.id).toBe('1')
      expect(mockDb.insert).toHaveBeenCalledWith(media)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(error)
      }
      mockDb.insert.mockReturnValue(mockInsert)

      await expect(
        repository.createAndSave({
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024,
          data: Buffer.from('test')
        })
      ).rejects.toThrow('Database error')
    })
  })

  describe('deleteById', () => {
    it('should delete media by id', async () => {
      const mockDelete = {
        where: jest.fn().mockResolvedValue(undefined)
      }
      mockDb.delete.mockReturnValue(mockDelete)

      const result = await repository.deleteById('1')

      expect(result).toBe(true)
      expect(mockDb.delete).toHaveBeenCalledWith(media)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockDelete = {
        where: jest.fn().mockRejectedValue(error)
      }
      mockDb.delete.mockReturnValue(mockDelete)

      await expect(repository.deleteById('1')).rejects.toThrow('Database error')
    })
  })

  describe('update', () => {
    it('should update media', async () => {
      const updateData = {
        fileName: 'updated.jpg'
      }
      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockResolvedValue([
            { id: '1', ...updateData, updatedAt: new Date() }
          ])
      }
      mockDb.update.mockReturnValue(mockUpdate)

      const result = await repository.update('1', updateData)

      expect(result?.id).toBe('1')
      expect(mockDb.update).toHaveBeenCalledWith(media)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(error)
      }
      mockDb.update.mockReturnValue(mockUpdate)

      await expect(
        repository.update('1', { fileName: 'updated.jpg' })
      ).rejects.toThrow('Database error')
    })
  })

  describe('findByContentHash', () => {
    it('should find media by content hash', async () => {
      const mockMedia = {
        id: '1',
        contentHash: 'hash123'
      }
      mockDb.query.media.findFirst.mockResolvedValue(mockMedia)

      const result = await repository.findByContentHash('hash123')

      expect(result).toEqual(mockMedia)
    })

    it('should return null if not found', async () => {
      mockDb.query.media.findFirst.mockResolvedValue(null)

      const result = await repository.findByContentHash('hash123')

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockDb.query.media.findFirst.mockRejectedValue(error)

      await expect(repository.findByContentHash('hash123')).rejects.toThrow(
        'Database error'
      )
    })
  })

  describe('findByNameAndTag', () => {
    it('should find media by name and tag', async () => {
      const mockMedia = {
        id: '1',
        fileName: 'test.jpg',
        tags: ['tag1']
      }
      mockDb.query.media.findFirst.mockResolvedValue(mockMedia)

      const result = await repository.findByNameAndTag('test.jpg', 'tag1')

      expect(result).toEqual(mockMedia)
    })

    it('should return null if not found', async () => {
      mockDb.query.media.findFirst.mockResolvedValue(null)

      const result = await repository.findByNameAndTag('test.jpg', 'tag1')

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockDb.query.media.findFirst.mockRejectedValue(error)

      await expect(
        repository.findByNameAndTag('test.jpg', 'tag1')
      ).rejects.toThrow('Database error')
    })
  })
})
