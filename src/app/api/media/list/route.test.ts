import { GET } from './route'
import { MediaService } from '@/features/media/lib/media.service'
import { handleApiError } from '@/lib/utilities/api-error-handler'

// Mock dependencies
jest.mock('@/features/media/lib/media.service', () => ({
  MediaService: jest.fn()
}))

jest.mock('@/lib/utilities/api-error-handler', () => ({
  handleApiError: jest.fn()
}))

describe('Media List API Route', () => {
  let mockMediaService: jest.Mocked<MediaService>

  beforeEach(() => {
    jest.clearAllMocks()
    mockMediaService = {
      getAll: jest.fn()
    } as unknown as jest.Mocked<MediaService>
    ;(MediaService as jest.MockedClass<typeof MediaService>).mockImplementation(
      () => mockMediaService
    )
  })

  describe('GET /api/media/list', () => {
    it('should return all media with wrapper', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024
        }
      ]
      mockMediaService.getAll.mockResolvedValue(mockMedia as never)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true, media: mockMedia })
      expect(mockMediaService.getAll).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockMediaService.getAll.mockRejectedValue(error)
      const mockErrorResponse = new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const response = await GET()

      expect(handleApiError).toHaveBeenCalledWith(error)
      expect(response).toBe(mockErrorResponse)
    })
  })
})
