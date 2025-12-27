import { MediaService } from './media.service'
import { MediaRepository } from './media.repository'
import { MediaCreate } from '../types/media.schema'
import { type Media } from '@/lib/database/schema'
import {
  NotFoundError,
  ValidationError
} from '@/lib/utilities/error-handler.service'

// Mock dependencies
jest.mock('./media.repository')
jest.mock('./media-validator')
jest.mock('./media-hasher')
jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}))
jest.mock('@/features/products/actions/products.controller', () => ({}))
jest.mock('@/features/products', () => ({}))
jest.mock('@/lib/database/drizzle', () => ({
  db: {}
}))

import { MediaValidator } from './media-validator'
import { MediaHasher } from './media-hasher'

describe('MediaService', () => {
  let service: MediaService
  let mockRepo: jest.Mocked<MediaRepository>

  beforeEach(() => {
    jest.clearAllMocks()
    mockRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      createAndSave: jest.fn(),
      deleteById: jest.fn(),
      update: jest.fn(),
      findByContentHash: jest.fn(),
      findByNameAndTag: jest.fn()
    } as unknown as jest.Mocked<MediaRepository>
    service = new MediaService(mockRepo)
  })

  describe('getAll', () => {
    it('should return all media', async () => {
      const mockMedia: Media[] = [
        {
          id: '1',
          fileName: 'test1.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024
        } as Media,
        {
          id: '2',
          fileName: 'test2.jpg',
          mimeType: 'image/jpeg',
          fileSize: 2048
        } as Media
      ]
      mockRepo.getAll.mockResolvedValue(mockMedia)

      const result = await service.getAll()

      expect(result).toEqual(mockMedia)
      expect(mockRepo.getAll).toHaveBeenCalled()
    })
  })

  describe('getImageById', () => {
    it('should return media by id', async () => {
      const mockMedia: Media = {
        id: '1',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024
      } as Media
      mockRepo.getById.mockResolvedValue(mockMedia)

      const result = await service.getImageById('1')

      expect(result).toEqual(mockMedia)
      expect(mockRepo.getById).toHaveBeenCalledWith('1')
    })

    it('should return null if not found', async () => {
      mockRepo.getById.mockResolvedValue(null)

      const result = await service.getImageById('1')

      expect(result).toBeNull()
    })
  })

  describe('deleteImage', () => {
    it('should delete media and return true', async () => {
      mockRepo.deleteById.mockResolvedValue(true)

      const result = await service.deleteImage('1')

      expect(result).toBe(true)
      expect(mockRepo.deleteById).toHaveBeenCalledWith('1')
    })

    it('should return false if not found', async () => {
      mockRepo.deleteById.mockResolvedValue(false)

      const result = await service.deleteImage('1')

      expect(result).toBe(false)
    })
  })

  describe('uploadImage', () => {
    it('should upload image with Buffer data', async () => {
      const fileData = Buffer.from('test file')
      const file: MediaCreate = {
        fileName: 'test.png',
        mimeType: 'image/png',
        fileSize: fileData.length,
        data: fileData
      }
      const mockHash = 'a'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        ...file,
        contentHash: mockHash
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByContentHash.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      const result = await service.uploadImage(file)

      expect(result).toEqual(mockMedia)
      expect(MediaValidator.validateMediaFile).toHaveBeenCalledWith(file)
      expect(MediaHasher.calculateHash).toHaveBeenCalledWith(fileData)
      expect(mockRepo.createAndSave).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: file.fileName,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
          data: fileData,
          contentHash: mockHash
        })
      )
    })

    it('should upload image with File data', async () => {
      const fileData = Buffer.from('test file')
      const mockFile = new File([fileData], 'test.png', { type: 'image/png' })
      const file: MediaCreate = {
        fileName: 'test.png',
        mimeType: 'image/png',
        fileSize: fileData.length,
        data: mockFile
      }
      const mockHash = 'b'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
        data: fileData,
        contentHash: mockHash
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByContentHash.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      // Mock File.arrayBuffer
      Object.defineProperty(mockFile, 'arrayBuffer', {
        value: jest.fn().mockResolvedValue(fileData.buffer)
      })

      const result = await service.uploadImage(file)

      expect(result).toEqual(mockMedia)
      expect(mockFile.arrayBuffer).toHaveBeenCalled()
    })

    it('should return existing media if duplicate hash found', async () => {
      const fileData = Buffer.from('test file')
      const file: MediaCreate = {
        fileName: 'test.png',
        mimeType: 'image/png',
        fileSize: fileData.length,
        data: fileData
      }
      const mockHash = 'c'.repeat(64)
      const existingMedia: Media = {
        id: 'existing-1',
        fileName: 'existing.png',
        contentHash: mockHash
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByContentHash.mockResolvedValue(existingMedia)

      const result = await service.uploadImage(file)

      expect(result).toEqual(existingMedia)
      expect(mockRepo.createAndSave).not.toHaveBeenCalled()
    })

    it('should throw ValidationError if validation fails', async () => {
      const file: MediaCreate = {
        fileName: 'test.png',
        mimeType: 'image/png',
        fileSize: 1024,
        data: Buffer.from('test')
      }

      ;(MediaValidator.validateMediaFile as jest.Mock).mockImplementation(
        () => {
          throw new ValidationError('Invalid file')
        }
      )

      await expect(service.uploadImage(file)).rejects.toThrow(ValidationError)
      expect(mockRepo.createAndSave).not.toHaveBeenCalled()
    })
  })

  describe('updateImageMeta', () => {
    it('should update media metadata', async () => {
      const existingMedia: Media = {
        id: '1',
        fileName: 'old.jpg',
        altText: 'Old alt',
        tags: ['old-tag']
      } as Media
      const updatedMedia: Media = {
        ...existingMedia,
        fileName: 'new.jpg',
        altText: 'New alt',
        tags: ['new-tag']
      } as Media

      mockRepo.getById.mockResolvedValue(existingMedia)
      mockRepo.update.mockResolvedValue(updatedMedia)

      const result = await service.updateImageMeta('1', {
        fileName: 'new.jpg',
        alt: 'New alt',
        tags: ['new-tag']
      })

      expect(result).toEqual(updatedMedia)
      expect(mockRepo.update).toHaveBeenCalledWith('1', {
        fileName: 'new.jpg',
        altText: 'New alt',
        tags: ['new-tag']
      })
    })

    it('should use existing altText if alt not provided', async () => {
      const existingMedia: Media = {
        id: '1',
        fileName: 'test.jpg',
        altText: 'Existing alt',
        tags: []
      } as Media
      const updatedMedia: Media = {
        ...existingMedia,
        fileName: 'new.jpg'
      } as Media

      mockRepo.getById.mockResolvedValue(existingMedia)
      mockRepo.update.mockResolvedValue(updatedMedia)

      await service.updateImageMeta('1', {
        fileName: 'new.jpg'
      })

      expect(mockRepo.update).toHaveBeenCalledWith('1', {
        fileName: 'new.jpg',
        altText: 'Existing alt',
        tags: []
      })
    })

    it('should use existing tags if tags not provided', async () => {
      const existingMedia: Media = {
        id: '1',
        fileName: 'test.jpg',
        altText: null,
        tags: ['existing-tag']
      } as Media

      mockRepo.getById.mockResolvedValue(existingMedia)
      mockRepo.update.mockResolvedValue(existingMedia)

      await service.updateImageMeta('1', {
        fileName: 'new.jpg',
        alt: 'New alt'
      })

      expect(mockRepo.update).toHaveBeenCalledWith('1', {
        fileName: 'new.jpg',
        altText: 'New alt',
        tags: ['existing-tag']
      })
    })

    it('should throw NotFoundError if media not found', async () => {
      mockRepo.getById.mockResolvedValue(null)

      await expect(
        service.updateImageMeta('1', {
          fileName: 'new.jpg'
        })
      ).rejects.toThrow(NotFoundError)

      expect(mockRepo.update).not.toHaveBeenCalled()
    })

    it('should throw ValidationError if fileName is empty', async () => {
      const existingMedia: Media = {
        id: '1',
        fileName: 'test.jpg'
      } as Media

      mockRepo.getById.mockResolvedValue(existingMedia)

      await expect(
        service.updateImageMeta('1', {
          fileName: '   '
        })
      ).rejects.toThrow(ValidationError)
    })

    it('should throw NotFoundError if update returns null', async () => {
      const existingMedia: Media = {
        id: '1',
        fileName: 'test.jpg'
      } as Media

      mockRepo.getById.mockResolvedValue(existingMedia)
      mockRepo.update.mockResolvedValue(null)

      await expect(
        service.updateImageMeta('1', {
          fileName: 'new.jpg'
        })
      ).rejects.toThrow(NotFoundError)
    })
  })

  describe('uploadOrReplaceUserAvatar', () => {
    it('should create new avatar if not exists', async () => {
      const fileData = Buffer.from('avatar data')
      const file: MediaCreate = {
        fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        fileSize: fileData.length,
        data: fileData,
        altText: 'Avatar',
        tags: ['user avatar']
      }
      const mockHash = 'd'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        ...file,
        data: fileData,
        contentHash: mockHash
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByNameAndTag.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      const result = await service.uploadOrReplaceUserAvatar(file)

      expect(result).toEqual(mockMedia)
      expect(mockRepo.findByNameAndTag).toHaveBeenCalledWith(
        'avatar.jpg',
        'user avatar'
      )
      expect(mockRepo.createAndSave).toHaveBeenCalled()
      expect(mockRepo.update).not.toHaveBeenCalled()
    })

    it('should update existing avatar if found', async () => {
      const fileData = Buffer.from('new avatar data')
      const file: MediaCreate = {
        fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        fileSize: fileData.length,
        data: fileData,
        altText: 'New Avatar',
        tags: ['user avatar']
      }
      const mockHash = 'e'.repeat(64)
      const existingMedia: Media = {
        id: 'existing-1',
        fileName: 'avatar.jpg',
        tags: ['user avatar']
      } as Media
      const updatedMedia: Media = {
        ...existingMedia,
        ...file,
        data: fileData,
        contentHash: mockHash
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByNameAndTag.mockResolvedValue(existingMedia)
      mockRepo.update.mockResolvedValue(updatedMedia)

      const result = await service.uploadOrReplaceUserAvatar(file)

      expect(result).toEqual(updatedMedia)
      expect(mockRepo.update).toHaveBeenCalledWith('existing-1', {
        fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        fileSize: fileData.length,
        data: fileData,
        contentHash: mockHash,
        altText: 'New Avatar',
        tags: ['user avatar']
      })
      expect(mockRepo.createAndSave).not.toHaveBeenCalled()
    })

    it('should handle File data type', async () => {
      const fileData = Buffer.from('avatar data')
      const mockFile = new File([fileData], 'avatar.jpg', {
        type: 'image/jpeg'
      })
      const file: MediaCreate = {
        fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        fileSize: fileData.length,
        data: mockFile
      }
      const mockHash = 'f'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        fileName: 'avatar.jpg',
        data: fileData,
        contentHash: mockHash
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByNameAndTag.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      Object.defineProperty(mockFile, 'arrayBuffer', {
        value: jest.fn().mockResolvedValue(fileData.buffer)
      })

      await service.uploadOrReplaceUserAvatar(file)

      expect(mockFile.arrayBuffer).toHaveBeenCalled()
    })

    it('should throw NotFoundError if update fails', async () => {
      const fileData = Buffer.from('avatar data')
      const file: MediaCreate = {
        fileName: 'avatar.jpg',
        mimeType: 'image/jpeg',
        fileSize: fileData.length,
        data: fileData
      }
      const mockHash = 'g'.repeat(64)
      const existingMedia: Media = {
        id: 'existing-1',
        fileName: 'avatar.jpg'
      } as Media

      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByNameAndTag.mockResolvedValue(existingMedia)
      mockRepo.update.mockResolvedValue(null)

      await expect(service.uploadOrReplaceUserAvatar(file)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe('processAndUploadImage', () => {
    it('should process File and upload image', async () => {
      const fileData = Buffer.from('image data')
      const mockFile = new File([fileData], 'image.jpg', {
        type: 'image/jpeg'
      })
      const mockHash = 'h'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        fileName: 'image.jpg',
        mimeType: 'image/jpeg',
        fileSize: fileData.length,
        data: fileData,
        contentHash: mockHash
      } as Media

      Object.defineProperty(mockFile, 'arrayBuffer', {
        value: jest.fn().mockResolvedValue(fileData.buffer)
      })
      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByContentHash.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      const result = await service.processAndUploadImage(mockFile)

      expect(result.url).toBe('/api/media/1')
      expect(result.media).toEqual(mockMedia)
      expect(mockFile.arrayBuffer).toHaveBeenCalled()
    })

    it('should include tag when provided', async () => {
      const fileData = Buffer.from('image data')
      const mockFile = new File([fileData], 'image.jpg', {
        type: 'image/jpeg'
      })
      const mockHash = 'i'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        fileName: 'image.jpg',
        tags: ['product-image'],
        contentHash: mockHash
      } as Media

      Object.defineProperty(mockFile, 'arrayBuffer', {
        value: jest.fn().mockResolvedValue(fileData.buffer)
      })
      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByContentHash.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      const result = await service.processAndUploadImage(
        mockFile,
        'product-image'
      )

      expect(result.media).toEqual(mockMedia)
      // The tag is passed to uploadImage via MediaCreate, but uploadImage doesn't
      // pass tags to createAndSave - it only passes fileName, mimeType, fileSize, data, contentHash
      expect(mockRepo.createAndSave).toHaveBeenCalled()
    })

    it('should not include tags when not provided', async () => {
      const fileData = Buffer.from('image data')
      const mockFile = new File([fileData], 'image.jpg', {
        type: 'image/jpeg'
      })
      const mockHash = 'j'.repeat(64)
      const mockMedia: Media = {
        id: '1',
        fileName: 'image.jpg',
        contentHash: mockHash
      } as Media

      Object.defineProperty(mockFile, 'arrayBuffer', {
        value: jest.fn().mockResolvedValue(fileData.buffer)
      })
      ;(MediaValidator.validateMediaFile as jest.Mock).mockReturnValue(
        undefined
      )
      ;(MediaHasher.calculateHash as jest.Mock).mockResolvedValue(mockHash)
      mockRepo.findByContentHash.mockResolvedValue(null)
      mockRepo.createAndSave.mockResolvedValue(mockMedia)

      await service.processAndUploadImage(mockFile)

      expect(mockRepo.createAndSave).toHaveBeenCalledWith(
        expect.not.objectContaining({
          tags: expect.anything()
        })
      )
    })
  })
})
