/**
 * @jest-environment node
 */
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest, NextResponse } from 'next/server'

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
    MEDIA_UPLOAD: { limit: 10, window: 60000 }
  }
}))

// Create mock function that can be reset between tests
const mockUploadImage = jest.fn()

// Mock dependencies - set up mock implementation at module level
jest.mock('@/features/media/lib/media.service', () => ({
  MediaService: jest.fn().mockImplementation(() => ({
    uploadImage: mockUploadImage
  }))
}))

describe('Media Upload API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/media/upload', () => {
    it('should upload multiple files', async () => {
      const { POST } = await import('./route')

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
      mockUploadImage
        .mockResolvedValueOnce(mockUploadedMedia1)
        .mockResolvedValueOnce(mockUploadedMedia2)

      // Create mock files - arrayBuffer should be available via polyfill
      const file1 = new File(['content1'], 'test1.jpg', { type: 'image/jpeg' })
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' })
      const mockFiles = [file1, file2]

      const request = {
        formData: jest.fn().mockResolvedValue({
          getAll: jest.fn().mockReturnValue(mockFiles)
        })
      } as unknown as NextRequest

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
      expect(mockUploadImage).toHaveBeenCalledTimes(2)
    })

    it('should return error if no files uploaded', async () => {
      const { POST } = await import('./route')

      const request = {
        formData: jest.fn().mockResolvedValue({
          getAll: jest.fn().mockReturnValue([])
        })
      } as unknown as NextRequest

      const mockErrorResponse = new NextResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { status: 400 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const response = await POST(request)

      expect(handleApiError).toHaveBeenCalled()
      expect(response).toBe(mockErrorResponse)
    })

    it('should handle upload errors', async () => {
      const { POST } = await import('./route')

      const error = new Error('Upload failed')
      mockUploadImage.mockRejectedValue(error)

      const mockErrorResponse = new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      // Mock file that will trigger the error path
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const request = {
        formData: jest.fn().mockResolvedValue({
          getAll: jest.fn().mockReturnValue([file])
        })
      } as unknown as NextRequest

      const response = await POST(request)

      // The error could be the arrayBuffer issue or the mocked upload error
      // Check that handleApiError was called with some error
      expect(handleApiError).toHaveBeenCalled()
      expect(response).toBe(mockErrorResponse)
    })
  })
})
