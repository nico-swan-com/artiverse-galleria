import { POST } from './route'
import { MediaService } from '@/features/media/lib/media.service'
import { handleApiError, ApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/features/media/lib/media.service', () => ({
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
  withRateLimit: jest.fn((config, handler) => handler),
  RATE_LIMIT_CONFIG: {
    MEDIA_UPLOAD: { limit: 10, window: 60000 }
  }
}))

describe('Media Upload API Route', () => {
  let mockMediaService: jest.Mocked<MediaService>

  beforeEach(() => {
    jest.clearAllMocks()
    mockMediaService = {
      uploadImage: jest.fn()
    } as unknown as jest.Mocked<MediaService>
    ;(MediaService as jest.MockedClass<typeof MediaService>).mockImplementation(
      () => mockMediaService
    )
  })

  describe('POST /api/media/upload', () => {
    it('should upload multiple files', async () => {
      const file1 = new File(['content1'], 'test1.jpg', { type: 'image/jpeg' })
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', file1)
      formData.append('file', file2)

      const mockUploadedMedia1 = {
        id: 'media-1',
        fileName: 'test1.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024
      }
      const mockUploadedMedia2 = {
        id: 'media-2',
        fileName: 'test2.jpg',
        mimeType: 'image/jpeg',
        fileSize: 2048
      }
      mockMediaService.uploadImage
        .mockResolvedValueOnce(mockUploadedMedia1 as never)
        .mockResolvedValueOnce(mockUploadedMedia2 as never)

      const request = new NextRequest('http://localhost/api/media/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        files: [
          { id: 'media-1', url: '/api/media/media-1' },
          { id: 'media-2', url: '/api/media/media-2' }
        ]
      })
      expect(mockMediaService.uploadImage).toHaveBeenCalledTimes(2)
    })

    it('should return error if no files uploaded', async () => {
      const formData = new FormData()
      const request = new NextRequest('http://localhost/api/media/upload', {
        method: 'POST',
        body: formData
      })

      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const response = await POST(request)

      expect(handleApiError).toHaveBeenCalled()
      expect(response).toBe(mockErrorResponse)
    })

    it('should handle upload errors', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', file)

      const error = new Error('Upload failed')
      mockMediaService.uploadImage.mockRejectedValue(error)
      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const request = new NextRequest('http://localhost/api/media/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)

      expect(handleApiError).toHaveBeenCalledWith(error)
      expect(response).toBe(mockErrorResponse)
    })
  })
})
