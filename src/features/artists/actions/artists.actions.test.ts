import {
  getAllArtistsCache,
  getPagedArtistsCache,
  getArtistByIdCache
} from './artists.actions'
import { artistsRepository } from '../lib/artists.repository'

// Mock dependencies
jest.mock('../lib/artists.repository', () => ({
  artistsRepository: {
    getAll: jest.fn(),
    getPaged: jest.fn(),
    getById: jest.fn()
  }
}))

jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn)
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: { error: jest.fn() }
}))

describe('Artists Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllArtistsCache', () => {
    it('should return all artists', async () => {
      const mockResult = {
        artists: [{ id: 'a1', name: 'Artist 1' }],
        total: 1
      }
      ;(artistsRepository.getAll as jest.Mock).mockResolvedValue(mockResult)

      const result = await getAllArtistsCache('name', 'ASC')

      expect(result).toEqual(mockResult)
      expect(artistsRepository.getAll).toHaveBeenCalledWith('name', 'ASC')
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error')
      ;(artistsRepository.getAll as jest.Mock).mockRejectedValue(error)

      const result = await getAllArtistsCache('name', 'ASC')

      expect(result).toEqual({ artists: [], total: 0 })
    })
  })

  describe('getPagedArtistsCache', () => {
    it('should return paged artists', async () => {
      const mockResult = {
        artists: [{ id: 'a1', name: 'Artist 1' }],
        total: 1
      }
      const pagination = { page: 1, limit: 10 }
      ;(artistsRepository.getPaged as jest.Mock).mockResolvedValue(mockResult)

      const result = await getPagedArtistsCache(
        pagination,
        'name',
        'ASC',
        'search'
      )

      expect(result).toEqual(mockResult)
      expect(artistsRepository.getPaged).toHaveBeenCalledWith(
        pagination,
        'name',
        'ASC',
        'search'
      )
    })
  })

  describe('getArtistByIdCache', () => {
    it('should return artist by id', async () => {
      const mockArtist = { id: 'a1', name: 'Artist 1' }
      ;(artistsRepository.getById as jest.Mock).mockResolvedValue(mockArtist)

      const result = await getArtistByIdCache('a1')

      expect(result).toEqual(mockArtist)
      expect(artistsRepository.getById).toHaveBeenCalledWith('a1')
    })

    it('should return null if not found', async () => {
      ;(artistsRepository.getById as jest.Mock).mockResolvedValue(null)

      const result = await getArtistByIdCache('a1')

      expect(result).toBeNull()
    })
  })
})
