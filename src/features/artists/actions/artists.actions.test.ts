import { getAllArtistsCache, getArtistByIdCache } from './artists.actions'
import { artistsRepository } from '../lib/artists.repository'

// Mock dependencies
// Mock DB to prevent loading issues
jest.mock('@/lib/database/drizzle', () => ({
  db: {}
}))

jest.mock('../lib/artists.repository', () => ({
  artistsRepository: {
    getAll: jest.fn(),
    getById: jest.fn()
  }
}))

jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn
}))

describe('Artists Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllArtistsCache', () => {
    it('should call repository.getAll', async () => {
      const mockResult = { artists: [], total: 0 }
      ;(artistsRepository.getAll as jest.Mock).mockResolvedValue(mockResult)

      const result = await getAllArtistsCache('name', 'ASC')

      expect(result).toEqual(mockResult)
      expect(artistsRepository.getAll).toHaveBeenCalledWith('name', 'ASC')
    })
  })

  describe('getArtistByIdCache', () => {
    it('should call repository.getById', async () => {
      const mockResult = { id: 'a1' }
      ;(artistsRepository.getById as jest.Mock).mockResolvedValue(mockResult)

      const result = await getArtistByIdCache('a1')

      expect(result).toEqual(mockResult)
      expect(artistsRepository.getById).toHaveBeenCalledWith('a1')
    })
  })
})
