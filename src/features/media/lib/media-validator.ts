import { MediaCreate } from '../types/media.schema'
import { FILE_CONFIG } from '@/shared/constants'
import { ValidationError } from '@/lib/utilities/error-handler.service'

/**
 * Media validation utility
 * Handles validation of media files and metadata
 * Follows Single Responsibility Principle by separating validation logic
 */
export class MediaValidator {
  /**
   * Validates media file data including required fields, size, and MIME type
   * @param file - Media file data to validate
   * @throws ValidationError if validation fails (missing fields, file too large, or invalid MIME type)
   */
  static validateMediaFile(file: MediaCreate): void {
    if (!file.fileName || !file.mimeType || !file.fileSize || !file.data) {
      throw new ValidationError(
        'Invalid media file data: missing required fields'
      )
    }

    if (file.fileSize > FILE_CONFIG.MAX_FILE_SIZE) {
      throw new ValidationError(
        `File is too large. Maximum allowed size is ${FILE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        'fileSize'
      )
    }

    // Validate MIME type
    if (
      !FILE_CONFIG.ACCEPTED_IMAGE_TYPES.includes(
        file.mimeType as (typeof FILE_CONFIG.ACCEPTED_IMAGE_TYPES)[number]
      )
    ) {
      throw new ValidationError(
        `Invalid file type. Accepted types: ${FILE_CONFIG.ACCEPTED_IMAGE_TYPES.join(', ')}`,
        'mimeType'
      )
    }
  }

  /**
   * Validates file size specifically for avatar uploads
   * Avatars typically have stricter size limits than general media
   * @param fileSize - File size in bytes
   * @throws ValidationError if file exceeds maximum avatar size
   */
  static validateAvatarSize(fileSize: number): void {
    if (fileSize > FILE_CONFIG.MAX_AVATAR_SIZE) {
      throw new ValidationError(
        `Avatar file is too large. Maximum allowed size is ${FILE_CONFIG.MAX_AVATAR_SIZE / (1024 * 1024)}MB.`,
        'fileSize'
      )
    }
  }
}
