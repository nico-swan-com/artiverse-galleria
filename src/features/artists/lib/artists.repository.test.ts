import { ArtistsRepository } from './artists.repository'
import { db } from '@/lib/database/drizzle'
import { logger } from '@/lib/utilities/logger'
import * as Mappers from '@/lib/database/mappers/artist.mapper'

// Mock dependencies
jest.mock('@/lib/database/drizzle', () => ({
  db: {
    query: {
      artists: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn()
  }
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

jest.mock('@/lib/database/mappers/artist.mapper', () => ({
  mapArtistsToAppType: jest.fn(),
  mapArtistToAppType: jest.fn()
}))

const createChainableMock = () => {
  const mock = {
    from: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
  }
  return mock
}

describe('ArtistsRepository', () => {
  let repository: ArtistsRepository
  let mockDbInfo: any

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new ArtistsRepository()
    mockDbInfo = db as any
  })

  describe('getAll', () => {
    it('should return mapped artists', async () => {
      const mockDbResult = [{ id: 'a1' }]
      const mockMappedResult = [{ id: 'a1', name: 'Artist 1' }]

      mockDbInfo.query.artists.findMany.mockResolvedValue(mockDbResult)
      ;(Mappers.mapArtistsToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getAll()

      expect(result.artists).toEqual(mockMappedResult)
      expect(result.total).toBe(1)
    })
  })

  describe('getById', () => {
    it('should return mapped artist if found', async () => {
      const mockDbResult = { id: 'a1' }
      const mockMappedResult = { id: 'a1', name: 'Artist 1' }

      mockDbInfo.query.artists.findFirst.mockResolvedValue(mockDbResult)
      ;(Mappers.mapArtistToAppType as jest.Mock).mockReturnValue(
        mockMappedResult
      )

      const result = await repository.getById('a1')

      expect(result).toEqual(mockMappedResult)
    })

    it('should return null if not found', async () => {
      mockDbInfo.query.artists.findFirst.mockResolvedValue(null)
      const result = await repository.getById('a1')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return mapped artist', async () => {
      const input = { name: 'New Artist', bio: 'Bio' }
      const inserted = { id: 'new', ...input }
      const mapped = { id: 'new', ...input }

      const mockInsert = createChainableMock()
      mockInsert.returning.mockResolvedValue([inserted])
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)
      ;(Mappers.mapArtistToAppType as jest.Mock).mockReturnValue(mapped)

      const result = await repository.create(input as any)

      expect(result).toEqual(mapped)
    })
  })

  describe('update', () => {
    it('should update artist', async () => {
      const updateData = { id: 'a1', name: 'Updated' }

      const mockUpdate = createChainableMock()
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      await repository.update(updateData as any)

      expect(db.update).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete artist', async () => {
      const mockDelete = createChainableMock()
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      await repository.delete('a1')
      expect(db.delete).toHaveBeenCalled()
    })
  })
})
