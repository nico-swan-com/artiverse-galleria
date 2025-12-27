import {
  uploadMedia,
  deleteMediaAction,
  updateMediaMetadata
} from './media.actions'
import { MediaService } from '../lib/media.service'
import { MediaNotFoundError, MediaValidationError } from '../lib/media.errors'

// Mock dependencies
jest.mock('../lib/media.service')
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))
jest.mock('@/lib/utilities/logger', () => ({
  logger: { error: jest.fn() }
}))

describe('Media Actions', () => {
  let mockMediaService: jest.Mocked<MediaService>

  beforeEach(() => {
    jest.clearAllMocks()
    mockMediaService = {
      uploadImage: jest.fn(),
      deleteImage: jest.fn(),
      updateImageMeta: jest.fn()
    } as unknown as jest.Mocked<MediaService>
    ;(MediaService as jest.MockedClass<typeof MediaService>).mockImplementation(
      () => mockMediaService
    )
  })

  describe('uploadMedia', () => {
    it('should upload media successfully', async () => {
      const input = {
        data: Buffer.from('test'),
        mimeType: 'image/jpeg',
        fileSize: 1024,
        fileName: 'test.jpg'
      }
      const output = {
        id: 'media-1',
        ...input
      }
      mockMediaService.uploadImage.mockResolvedValue(output as never)

      const result = await uploadMedia(input)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(output)
      expect(mockMediaService.uploadImage).toHaveBeenCalledWith(input)
    })

    it('should handle validation errors', async () => {
      const input = {
        data: Buffer.from('test'),
        mimeType: 'image/jpeg',
        fileSize: 1024,
        fileName: 'test.jpg'
      }
      const error = new MediaValidationError('Invalid file type')
      mockMediaService.uploadImage.mockRejectedValue(error)

      const result = await uploadMedia(input)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid file type')
    })

    it('should handle generic errors', async () => {
      const input = {
        data: Buffer.from('test'),
        mimeType: 'image/jpeg',
        fileSize: 1024,
        fileName: 'test.jpg'
      }
      mockMediaService.uploadImage.mockRejectedValue(new Error('Upload failed'))

      const result = await uploadMedia(input)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to upload media')
    })
  })

  describe('deleteMediaAction', () => {
    it('should delete media successfully', async () => {
      mockMediaService.deleteImage.mockResolvedValue(true)

      const result = await deleteMediaAction('media-1')

      expect(result.success).toBe(true)
      expect(mockMediaService.deleteImage).toHaveBeenCalledWith('media-1')
    })

    it('should handle not found errors', async () => {
      mockMediaService.deleteImage.mockResolvedValue(false)

      const result = await deleteMediaAction('media-1')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle generic errors', async () => {
      mockMediaService.deleteImage.mockRejectedValue(new Error('Delete failed'))

      const result = await deleteMediaAction('media-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete media')
    })
  })

  describe('updateMediaMetadata', () => {
    it('should update media metadata successfully', async () => {
      const meta = {
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      const output = {
        id: 'media-1',
        ...meta
      }
      mockMediaService.updateImageMeta.mockResolvedValue(output as never)

      const result = await updateMediaMetadata('media-1', meta)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(output)
      expect(mockMediaService.updateImageMeta).toHaveBeenCalledWith(
        'media-1',
        meta
      )
    })

    it('should handle not found errors', async () => {
      const meta = {
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      const error = new MediaNotFoundError('media-1')
      mockMediaService.updateImageMeta.mockRejectedValue(error)

      const result = await updateMediaMetadata('media-1', meta)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle validation errors', async () => {
      const meta = {
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      const error = new MediaValidationError('Invalid file name')
      mockMediaService.updateImageMeta.mockRejectedValue(error)

      const result = await updateMediaMetadata('media-1', meta)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid file name')
    })
  })
})
