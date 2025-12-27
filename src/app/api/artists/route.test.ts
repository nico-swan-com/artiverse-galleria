import { ArtistsController } from '@/features/artists/actions/artists.controller'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest, NextResponse } from 'next/server'

// Mock dependencies
jest.mock('@/features/artists/actions/artists.controller')
jest.mock('@/lib/utilities/api-error-handler', () => ({
  handleApiError: jest.fn()
}))
jest.mock('@/lib/security', () => ({
  withRateLimit: jest.fn((_config, handler) => handler),
  RATE_LIMIT_CONFIG: {
    API: { limit: 100, window: 60000 }
  }
}))

describe('Artists API Route', () => {
  const mockGetAllArtistsPublic = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock the prototype method
    ArtistsController.prototype.getAllArtistsPublic = mockGetAllArtistsPublic
  })

  describe('GET /api/artists', () => {
    it('should return artists', async () => {
      // Dynamically import to get fresh module with mocks applied
      const { GET } = await import('./route')

      const mockResponse = new NextResponse(
        JSON.stringify({ artists: [], total: 0 }),
        { status: 200 }
      )
      mockGetAllArtistsPublic.mockResolvedValue(mockResponse)

      const request = new NextRequest('http://localhost/api/artists')
      const response = await GET(request)

      expect(mockGetAllArtistsPublic).toHaveBeenCalledWith(request)
      expect(response).toBe(mockResponse)
    })

    it('should handle errors', async () => {
      const { GET } = await import('./route')

      const error = new Error('Database error')
      mockGetAllArtistsPublic.mockRejectedValue(error)
      const mockErrorResponse = new NextResponse(
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
