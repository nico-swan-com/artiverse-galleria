/* eslint-disable @typescript-eslint/no-require-imports */
import { MediaValidator } from './media-validator'
import { ValidationError } from '@/lib/utilities/error-handler.service'
import { MediaCreate } from '../types/media.schema'

// Mock FILE_CONFIG
jest.mock('@/shared/constants', () => ({
  FILE_CONFIG: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
    ACCEPTED_IMAGE_TYPES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
  }
}))

describe('MediaValidator', () => {
  describe('validateMediaFile', () => {
    it('should not throw for valid media file', () => {
      const validFile: MediaCreate = {
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024 * 1024, // 1MB
        data: Buffer.from('test data')
      }

      expect(() => MediaValidator.validateMediaFile(validFile)).not.toThrow()
    })

    it('should throw ValidationError if fileName is missing', () => {
      const invalidFile = {
        mimeType: 'image/jpeg',
        fileSize: 1024,
        data: Buffer.from('test')
      } as MediaCreate

      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        ValidationError
      )
      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        'Invalid media file data: missing required fields'
      )
    })

    it('should throw ValidationError if mimeType is missing', () => {
      const invalidFile = {
        fileName: 'test.jpg',
        fileSize: 1024,
        data: Buffer.from('test')
      } as MediaCreate

      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        ValidationError
      )
      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        'Invalid media file data: missing required fields'
      )
    })

    it('should throw ValidationError if fileSize is missing', () => {
      const invalidFile = {
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        data: Buffer.from('test')
      } as MediaCreate

      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        ValidationError
      )
    })

    it('should throw ValidationError if data is missing', () => {
      const invalidFile = {
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024
      } as MediaCreate

      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        ValidationError
      )
    })

    it('should throw ValidationError if fileSize exceeds MAX_FILE_SIZE', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const invalidFile: MediaCreate = {
        fileName: 'large.jpg',
        mimeType: 'image/jpeg',
        fileSize: FILE_CONFIG.MAX_FILE_SIZE + 1,
        data: Buffer.from('test')
      }

      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        ValidationError
      )
      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        'File is too large'
      )
      expect(() => {
        try {
          MediaValidator.validateMediaFile(invalidFile)
        } catch (error) {
          if (error instanceof ValidationError) {
            expect(error.field).toBe('fileSize')
          }
          throw error
        }
      }).toThrow(ValidationError)
    })

    it('should allow fileSize equal to MAX_FILE_SIZE', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const validFile: MediaCreate = {
        fileName: 'max-size.jpg',
        mimeType: 'image/jpeg',
        fileSize: FILE_CONFIG.MAX_FILE_SIZE,
        data: Buffer.from('test')
      }

      expect(() => MediaValidator.validateMediaFile(validFile)).not.toThrow()
    })

    it('should throw ValidationError for invalid MIME type', () => {
      const invalidFile: MediaCreate = {
        fileName: 'test.txt',
        mimeType: 'text/plain',
        fileSize: 1024,
        data: Buffer.from('test')
      }

      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        ValidationError
      )
      expect(() => MediaValidator.validateMediaFile(invalidFile)).toThrow(
        'Invalid file type'
      )
      expect(() => {
        try {
          MediaValidator.validateMediaFile(invalidFile)
        } catch (error) {
          if (error instanceof ValidationError) {
            expect(error.field).toBe('mimeType')
          }
          throw error
        }
      }).toThrow(ValidationError)
    })

    it('should accept valid MIME types', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const validTypes = FILE_CONFIG.ACCEPTED_IMAGE_TYPES

      validTypes.forEach((mimeType: string) => {
        const validFile: MediaCreate = {
          fileName: 'test.jpg',
          mimeType,
          fileSize: 1024,
          data: Buffer.from('test')
        }

        expect(() => MediaValidator.validateMediaFile(validFile)).not.toThrow()
      })
    })

    it('should throw ValidationError with correct field for fileSize', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const invalidFile: MediaCreate = {
        fileName: 'large.jpg',
        mimeType: 'image/jpeg',
        fileSize: FILE_CONFIG.MAX_FILE_SIZE + 1,
        data: Buffer.from('test')
      }

      try {
        MediaValidator.validateMediaFile(invalidFile)
        fail('Should have thrown ValidationError')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).field).toBe('fileSize')
      }
    })

    it('should throw ValidationError with correct field for mimeType', () => {
      const invalidFile: MediaCreate = {
        fileName: 'test.txt',
        mimeType: 'application/pdf',
        fileSize: 1024,
        data: Buffer.from('test')
      }

      try {
        MediaValidator.validateMediaFile(invalidFile)
        fail('Should have thrown ValidationError')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).field).toBe('mimeType')
      }
    })
  })

  describe('validateAvatarSize', () => {
    it('should not throw for valid avatar size', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const validSize = FILE_CONFIG.MAX_AVATAR_SIZE - 1

      expect(() => MediaValidator.validateAvatarSize(validSize)).not.toThrow()
    })

    it('should throw ValidationError if fileSize exceeds MAX_AVATAR_SIZE', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const invalidSize = FILE_CONFIG.MAX_AVATAR_SIZE + 1

      expect(() => MediaValidator.validateAvatarSize(invalidSize)).toThrow(
        ValidationError
      )
      expect(() => MediaValidator.validateAvatarSize(invalidSize)).toThrow(
        'Avatar file is too large'
      )
      expect(() => {
        try {
          MediaValidator.validateAvatarSize(invalidSize)
        } catch (error) {
          if (error instanceof ValidationError) {
            expect(error.field).toBe('fileSize')
          }
          throw error
        }
      }).toThrow(ValidationError)
    })

    it('should allow fileSize equal to MAX_AVATAR_SIZE', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const validSize = FILE_CONFIG.MAX_AVATAR_SIZE

      expect(() => MediaValidator.validateAvatarSize(validSize)).not.toThrow()
    })

    it('should throw ValidationError with correct field', () => {
      const { FILE_CONFIG } = require('@/shared/constants')
      const invalidSize = FILE_CONFIG.MAX_AVATAR_SIZE + 1

      try {
        MediaValidator.validateAvatarSize(invalidSize)
        fail('Should have thrown ValidationError')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).field).toBe('fileSize')
        expect((error as ValidationError).message).toContain(
          'Avatar file is too large'
        )
      }
    })

    it('should handle zero size', () => {
      expect(() => MediaValidator.validateAvatarSize(0)).not.toThrow()
    })

    it('should handle small sizes', () => {
      expect(() => MediaValidator.validateAvatarSize(1)).not.toThrow()
      expect(() => MediaValidator.validateAvatarSize(100)).not.toThrow()
      expect(() => MediaValidator.validateAvatarSize(1024)).not.toThrow()
    })
  })
})
