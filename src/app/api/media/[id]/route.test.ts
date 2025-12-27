import { GET, DELETE, PATCH } from './route'
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

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}))

describe('Media [id] API Route', () => {
  let mockMediaService: jest.Mocked<MediaService>

  beforeEach(() => {
    jest.clearAllMocks()
    mockMediaService = {
      getImageById: jest.fn(),
      deleteImage: jest.fn(),
      updateImageMeta: jest.fn()
    } as unknown as jest.Mocked<MediaService>
    ;(MediaService as jest.MockedClass<typeof MediaService>).mockImplementation(
      () => mockMediaService
    )
  })

  describe('GET /api/media/[id]', () => {
    it('should return media by id', async () => {
      const mockMedia = {
        id: 'media-1',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024,
        data: Buffer.from('test')
      }
      mockMediaService.getImageById.mockResolvedValue(mockMedia as never)

      const request = new NextRequest('http://localhost/api/media/media-1')
      const context = { params: Promise.resolve({ id: 'media-1' }) }
      const response = await GET(request, context)

      expect(response.status).toBe(200)
      expect(mockMediaService.getImageById).toHaveBeenCalledWith('media-1')
    })

    it('should handle not found', async () => {
      mockMediaService.getImageById.mockResolvedValue(null)
      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const request = new NextRequest('http://localhost/api/media/media-1')
      const context = { params: Promise.resolve({ id: 'media-1' }) }
      const response = await GET(request, context)

      expect(handleApiError).toHaveBeenCalled()
      expect(response).toBe(mockErrorResponse)
    })
  })

  describe('DELETE /api/media/[id]', () => {
    it('should delete media', async () => {
      mockMediaService.deleteImage.mockResolvedValue(true)

      const request = new NextRequest('http://localhost/api/media/media-1', {
        method: 'DELETE'
      })
      const context = { params: Promise.resolve({ id: 'media-1' }) }
      const response = await DELETE(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(mockMediaService.deleteImage).toHaveBeenCalledWith('media-1')
    })

    it('should handle not found', async () => {
      mockMediaService.deleteImage.mockResolvedValue(false)
      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const request = new NextRequest('http://localhost/api/media/media-1', {
        method: 'DELETE'
      })
      const context = { params: Promise.resolve({ id: 'media-1' }) }
      const response = await DELETE(request, context)

      expect(handleApiError).toHaveBeenCalled()
      expect(response).toBe(mockErrorResponse)
    })
  })

  describe('PATCH /api/media/[id]', () => {
    it('should update media metadata', async () => {
      const mockUpdated = {
        id: 'media-1',
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      mockMediaService.updateImageMeta.mockResolvedValue(mockUpdated as never)

      const request = new NextRequest('http://localhost/api/media/media-1', {
        method: 'PATCH',
        body: JSON.stringify({
          fileName: 'updated.jpg',
          alt: 'Updated alt text',
          tags: ['tag1', 'tag2']
        })
      })
      const context = { params: Promise.resolve({ id: 'media-1' }) }
      const response = await PATCH(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdated)
      expect(mockMediaService.updateImageMeta).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'Validation error' }),
        { status: 400 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const request = new NextRequest('http://localhost/api/media/media-1', {
        method: 'PATCH',
        body: JSON.stringify({})
      })
      const context = { params: Promise.resolve({ id: 'media-1' }) }
      const response = await PATCH(request, context)

      expect(handleApiError).toHaveBeenCalled()
      expect(response).toBe(mockErrorResponse)
    })
  })
})
