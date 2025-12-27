import { GET, POST } from './route'
import { MediaService } from '@/features/media'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest, NextResponse } from 'next/server'

// Mock dependencies
jest.mock('@/features/media', () => ({
  MediaService: jest.fn()
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
  let mockMediaService: jest.Mocked<MediaService>

  beforeEach(() => {
    jest.clearAllMocks()
    mockMediaService = {
      getAll: jest.fn(),
      uploadImage: jest.fn()
    } as unknown as jest.Mocked<MediaService>
    ;(MediaService as jest.MockedClass<typeof MediaService>).mockImplementation(
      () => mockMediaService
    )
  })

  describe('GET /api/media', () => {
    it('should return all media', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024
        }
      ]
      mockMediaService.getAll.mockResolvedValue(mockMedia as never)

      const response = await GET(new NextRequest('http://localhost/api/media'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockMedia)
      expect(mockMediaService.getAll).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockMediaService.getAll.mockRejectedValue(error)
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
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', file)

      const mockUploadedMedia = {
        id: 'media-1',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024
      }
      mockMediaService.uploadImage.mockResolvedValue(mockUploadedMedia as never)

      const request = new NextRequest('http://localhost/api/media', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUploadedMedia)
      expect(mockMediaService.uploadImage).toHaveBeenCalled()
    })

    it('should return error if no file uploaded', async () => {
      const formData = new FormData()
      const request = new NextRequest('http://localhost/api/media', {
        method: 'POST',
        body: formData
      })

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
