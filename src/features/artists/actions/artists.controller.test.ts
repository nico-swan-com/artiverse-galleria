import { ArtistsController } from './artists.controller'
import ArtistsService from '../lib/artists.service'
import { NextRequest } from 'next/server'
import { validateSearchQuery } from '@/lib/utilities/search-query.util'

// Mock dependencies
jest.mock('../lib/artists.service', () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock('@/lib/utilities/search-query.util', () => ({
  validateSearchQuery: jest.fn((query) => query || '')
}))

describe('ArtistsController', () => {
  let controller: ArtistsController
  let mockArtistsService: jest.Mocked<ArtistsService>

  beforeEach(() => {
    jest.clearAllMocks()
    controller = new ArtistsController()
    mockArtistsService = {
      getAll: jest.fn(),
      getPaged: jest.fn()
    } as unknown as jest.Mocked<ArtistsService>
    ;(
      ArtistsService as jest.MockedClass<typeof ArtistsService>
    ).mockImplementation(() => mockArtistsService)
  })

  describe('getAllArtistsPublic', () => {
    it('should return all artists with default sorting', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Artist 1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockArtistsService.getAll.mockResolvedValue({
        artists: mockArtists,
        total: 1
      })

      const request = new NextRequest(
        'http://localhost/api/artists/all'
      ) as NextRequest

      const response = await controller.getAllArtistsPublic(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.artists).toEqual([
        {
          id: '1',
          name: 'Artist 1'
        }
      ])
      expect(data.total).toBe(1)
      expect(mockArtistsService.getAll).toHaveBeenCalledWith('name', 'DESC')
    })

    it('should use query parameters for sorting', async () => {
      mockArtistsService.getAll.mockResolvedValue({
        artists: [],
        total: 0
      })

      const request = new NextRequest(
        'http://localhost/api/artists/all?sortBy=createdAt&order=ASC'
      ) as NextRequest

      await controller.getAllArtistsPublic(request)

      expect(mockArtistsService.getAll).toHaveBeenCalledWith('createdAt', 'ASC')
    })

    it('should sanitize artists (remove createdAt and updatedAt)', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Artist 1',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
          bio: 'Bio'
        },
        {
          id: '2',
          name: 'Artist 2',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02')
        }
      ]
      mockArtistsService.getAll.mockResolvedValue({
        artists: mockArtists,
        total: 2
      })

      const request = new NextRequest(
        'http://localhost/api/artists/all'
      ) as NextRequest

      const response = await controller.getAllArtistsPublic(request)
      const data = await response.json()

      expect(data.artists).toEqual([
        { id: '1', name: 'Artist 1', bio: 'Bio' },
        { id: '2', name: 'Artist 2' }
      ])
      expect(data.artists[0]).not.toHaveProperty('createdAt')
      expect(data.artists[0]).not.toHaveProperty('updatedAt')
    })
  })

  describe('getArtistsPublic', () => {
    it('should return paged artists with default parameters', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Artist 1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockArtistsService.getPaged.mockResolvedValue({
        artists: mockArtists,
        total: 1
      })

      const request = new NextRequest(
        'http://localhost/api/artists'
      ) as NextRequest

      const response = await controller.getArtistsPublic(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.artists).toEqual([{ id: '1', name: 'Artist 1' }])
      expect(data.total).toBe(1)
      expect(mockArtistsService.getPaged).toHaveBeenCalledWith(
        { page: 1, limit: 3 },
        'name',
        'DESC',
        ''
      )
    })

    it('should use query parameters for pagination and sorting', async () => {
      mockArtistsService.getPaged.mockResolvedValue({
        artists: [],
        total: 0
      })

      const request = new NextRequest(
        'http://localhost/api/artists?page=2&limit=10&sortBy=createdAt&order=ASC&query=test'
      ) as NextRequest

      ;(validateSearchQuery as jest.Mock).mockReturnValue('test')

      await controller.getArtistsPublic(request)

      expect(mockArtistsService.getPaged).toHaveBeenCalledWith(
        { page: 2, limit: 10 },
        'createdAt',
        'ASC',
        'test'
      )
    })

    it('should sanitize artists (remove createdAt and updatedAt)', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Artist 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          email: 'test@example.com'
        }
      ]
      mockArtistsService.getPaged.mockResolvedValue({
        artists: mockArtists,
        total: 1
      })

      const request = new NextRequest(
        'http://localhost/api/artists'
      ) as NextRequest

      const response = await controller.getArtistsPublic(request)
      const data = await response.json()

      expect(data.artists[0]).not.toHaveProperty('createdAt')
      expect(data.artists[0]).not.toHaveProperty('updatedAt')
      expect(data.artists[0]).toHaveProperty('email')
    })
  })
})
