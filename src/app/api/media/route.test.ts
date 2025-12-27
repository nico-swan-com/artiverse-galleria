/**
 * @jest-environment node
 */
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest, NextResponse } from 'next/server'

// Create mock functions that can be reset between tests
const mockGetAll = jest.fn()
const mockUploadImage = jest.fn()

// Mock dependencies - set up mock implementation at module level
jest.mock('@/features/media', () => ({
  MediaService: jest.fn().mockImplementation(() => ({
    getAll: mockGetAll,
    uploadImage: mockUploadImage
  })),
  MediaCreate: {}
}))
jest.mock('@/lib/utilities/api-error-handler', () => ({
  handleApiError: jest.fn(),
  ApiError: jest.fn().mockImplementation((status, message) => {
    const error = new Error(message) as Error & { statusCode?: number }
    error.statusCode = status
    return error
  })
}))
jest.mock('@/lib/security', () => ({
  withRateLimit: jest.fn((_config, handler) => handler),
  RATE_LIMIT_CONFIG: {
    API: { limit: 100, window: 60000 },
    MEDIA_UPLOAD: { limit: 10, window: 60000 }
  }
}))

describe('Media API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/media', () => {
    it('should return all media', async () => {
      const { GET } = await import('./route')

      const mockMedia = [
        {
          id: 'media-1',
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024
        }
      ]
      mockGetAll.mockResolvedValue(mockMedia)

      const response = await GET(new NextRequest('http://localhost/api/media'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockMedia)
      expect(mockGetAll).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const { GET } = await import('./route')

      const error = new Error('Database error')
      mockGetAll.mockRejectedValue(error)
      const mockErrorResponse = new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const response = await GET(new NextRequest('http://localhost/api/media'))
      expect(response).toBe(mockErrorResponse)

      expect(handleApiError).toHaveBeenCalledWith(error)
    })
  })

  describe('POST /api/media', () => {
    it('should upload a file', async () => {
      const { POST } = await import('./route')

      const mockUploadedMedia = {
        id: 'media-1',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024
      }
      mockUploadImage.mockResolvedValue(mockUploadedMedia)

      // Create a mock file - arrayBuffer should be available via polyfill
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const request = {
        formData: jest.fn().mockResolvedValue({
          get: jest.fn().mockImplementation((key: string) => {
            if (key === 'file') return mockFile
            return null
          })
        })
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUploadedMedia)
      expect(mockUploadImage).toHaveBeenCalled()
    })

    it('should return error if no file uploaded', async () => {
      const { POST } = await import('./route')

      const request = {
        formData: jest.fn().mockResolvedValue({
          get: jest.fn().mockReturnValue(null)
        })
      } as unknown as NextRequest

      const mockErrorResponse = new NextResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      await POST(request)

      expect(handleApiError).toHaveBeenCalled()
    })
  })
})
