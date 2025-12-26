/**
 * Media Domain Errors
 *
 * Custom error classes for the media domain.
 * These errors provide more specific error handling and messaging
 * for media-related operations.
 */

/**
 * Base class for all media-related errors
 */
export class MediaError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'MediaError'
  }
}

/**
 * Error thrown when a media file is not found
 */
export class MediaNotFoundError extends MediaError {
  constructor(identifier: string) {
    super(`Media not found: ${identifier}`, 'MEDIA_NOT_FOUND')
    this.name = 'MediaNotFoundError'
  }
}

/**
 * Error thrown when media validation fails
 */
export class MediaValidationError extends MediaError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'MEDIA_VALIDATION_ERROR')
    this.name = 'MediaValidationError'
  }
}

/**
 * Error thrown when file size exceeds limits
 */
export class FileSizeExceededError extends MediaError {
  constructor(maxSize: number, actualSize: number) {
    super(
      `File size ${actualSize} bytes exceeds maximum allowed ${maxSize} bytes`,
      'FILE_SIZE_EXCEEDED'
    )
    this.name = 'FileSizeExceededError'
  }
}

/**
 * Error thrown when file type is not supported
 */
export class UnsupportedFileTypeError extends MediaError {
  constructor(mimeType: string, supportedTypes: string[]) {
    super(
      `File type "${mimeType}" is not supported. Supported types: ${supportedTypes.join(', ')}`,
      'UNSUPPORTED_FILE_TYPE'
    )
    this.name = 'UnsupportedFileTypeError'
  }
}

/**
 * Error thrown when upload fails
 */
export class UploadFailedError extends MediaError {
  constructor(reason?: string) {
    super(
      reason ? `Upload failed: ${reason}` : 'Upload failed',
      'UPLOAD_FAILED'
    )
    this.name = 'UploadFailedError'
  }
}

/**
 * Error thrown when a duplicate media file is detected
 */
export class DuplicateMediaError extends MediaError {
  constructor(hash: string) {
    super(`Duplicate media file detected with hash: ${hash}`, 'DUPLICATE_MEDIA')
    this.name = 'DuplicateMediaError'
  }
}
