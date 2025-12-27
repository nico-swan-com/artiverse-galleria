import { MediaNotFoundError, MediaValidationError } from '../lib/media.errors'

// Create mock functions that can be reset between tests
const mockUploadImage = jest.fn()
const mockDeleteImage = jest.fn()
const mockUpdateImageMeta = jest.fn()

// Mock dependencies
jest.mock('../lib/media.service', () => ({
  MediaService: jest.fn().mockImplementation(() => ({
    uploadImage: mockUploadImage,
    deleteImage: mockDeleteImage,
    updateImageMeta: mockUpdateImageMeta
  }))
}))
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))
jest.mock('@/lib/utilities/logger', () => ({
  logger: { error: jest.fn() }
}))

describe('Media Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadMedia', () => {
    it('should upload media successfully', async () => {
      const { uploadMedia } = await import('./media.actions')

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
      mockUploadImage.mockResolvedValue(output)

      const result = await uploadMedia(input)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(output)
      expect(mockUploadImage).toHaveBeenCalledWith(input)
    })

    it('should handle validation errors', async () => {
      const { uploadMedia } = await import('./media.actions')

      const input = {
        data: Buffer.from('test'),
        mimeType: 'image/jpeg',
        fileSize: 1024,
        fileName: 'test.jpg'
      }
      const error = new MediaValidationError('Invalid file type')
      mockUploadImage.mockRejectedValue(error)

      const result = await uploadMedia(input)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid file type')
    })

    it('should handle generic errors', async () => {
      const { uploadMedia } = await import('./media.actions')

      const input = {
        data: Buffer.from('test'),
        mimeType: 'image/jpeg',
        fileSize: 1024,
        fileName: 'test.jpg'
      }
      mockUploadImage.mockRejectedValue(new Error('Upload failed'))

      const result = await uploadMedia(input)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to upload media')
    })
  })

  describe('deleteMediaAction', () => {
    it('should delete media successfully', async () => {
      const { deleteMediaAction } = await import('./media.actions')

      mockDeleteImage.mockResolvedValue(true)

      const result = await deleteMediaAction('media-1')

      expect(result.success).toBe(true)
      expect(mockDeleteImage).toHaveBeenCalledWith('media-1')
    })

    it('should handle not found errors', async () => {
      const { deleteMediaAction } = await import('./media.actions')

      mockDeleteImage.mockResolvedValue(false)

      const result = await deleteMediaAction('media-1')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle generic errors', async () => {
      const { deleteMediaAction } = await import('./media.actions')

      mockDeleteImage.mockRejectedValue(new Error('Delete failed'))

      const result = await deleteMediaAction('media-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete media')
    })
  })

  describe('updateMediaMetadata', () => {
    it('should update media metadata successfully', async () => {
      const { updateMediaMetadata } = await import('./media.actions')

      const meta = {
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      const output = {
        id: 'media-1',
        ...meta
      }
      mockUpdateImageMeta.mockResolvedValue(output)

      const result = await updateMediaMetadata('media-1', meta)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(output)
      expect(mockUpdateImageMeta).toHaveBeenCalledWith('media-1', meta)
    })

    it('should handle not found errors', async () => {
      const { updateMediaMetadata } = await import('./media.actions')

      const meta = {
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      const error = new MediaNotFoundError('media-1')
      mockUpdateImageMeta.mockRejectedValue(error)

      const result = await updateMediaMetadata('media-1', meta)

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should handle validation errors', async () => {
      const { updateMediaMetadata } = await import('./media.actions')

      const meta = {
        fileName: 'updated.jpg',
        alt: 'Updated alt text',
        tags: ['tag1', 'tag2']
      }
      const error = new MediaValidationError('Invalid file name')
      mockUpdateImageMeta.mockRejectedValue(error)

      const result = await updateMediaMetadata('media-1', meta)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid file name')
    })
  })
})
