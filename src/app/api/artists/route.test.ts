import { GET } from './route'
import { ArtistsController } from '@/features/artists/actions/artists.controller'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/features/artists/actions/artists.controller', () => ({
  ArtistsController: jest.fn()
}))

jest.mock('@/lib/utilities/api-error-handler', () => ({
  handleApiError: jest.fn()
}))

jest.mock('@/lib/security', () => ({
  withRateLimit: jest.fn((config, handler) => handler),
  RATE_LIMIT_CONFIG: {
    API: { limit: 100, window: 60000 }
  }
}))

describe('Artists API Route', () => {
  let mockController: jest.Mocked<ArtistsController>

  beforeEach(() => {
    jest.clearAllMocks()
    mockController = {
      getAllArtistsPublic: jest.fn()
    } as unknown as jest.Mocked<ArtistsController>
    ;(
      ArtistsController as jest.MockedClass<typeof ArtistsController>
    ).mockImplementation(() => mockController)
  })

  describe('GET /api/artists', () => {
    it('should return artists', async () => {
      const mockResponse = new Response(
        JSON.stringify({ artists: [], total: 0 }),
        { status: 200 }
      )
      mockController.getAllArtistsPublic.mockResolvedValue(mockResponse)

      const request = new NextRequest('http://localhost/api/artists')
      const response = await GET(request)

      expect(mockController.getAllArtistsPublic).toHaveBeenCalledWith(request)
      expect(response).toBe(mockResponse)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockController.getAllArtistsPublic.mockRejectedValue(error)
      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const request = new NextRequest('http://localhost/api/artists')
      const response = await GET(request)

      expect(handleApiError).toHaveBeenCalledWith(error)
      expect(response).toBe(mockErrorResponse)
    })
  })
})
