import { MediaRepository } from './media.repository'
import { Media, MediaCreate, MediaUpdate } from './model/media.schema'
import { MediaEntity } from './model/media.entity'
import crypto from 'crypto'

export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

export class MediaService {
  private mediaRepository: MediaRepository

  constructor() {
    this.mediaRepository = new MediaRepository()
  }

  /**
   * Get all media records.
   * @returns Array of Media entities
   */
  async getAll(): Promise<Media[]> {
    return this.mediaRepository.getAll()
  }

  /**
   * Get a media record by its ID.
   * @param id Media UUID
   * @returns Media entity or null
   */
  async getImageById(id: string): Promise<Media | null> {
    return this.mediaRepository.getById(id)
  }

  /**
   * Upload a new image to the media table.
   * @param fileName Original file name
   * @param mimeType MIME type
   * @param fileSize Size in bytes
   * @param data Buffer containing image data
   * @returns The created Media entity
   */
  async uploadImage(file: MediaCreate): Promise<Media> {
    if (!file.fileName || !file.mimeType || !file.fileSize || !file.data) {
      throw new Error('Invalid media file data')
    }

    if (file.fileSize > MAX_FILE_SIZE) {
      const err = new Error(
        'File is too large. Maximum allowed size is 5MB.'
      ) as Error & { status?: number }
      err.status = 400
      throw err
    }

    let bufferData: Buffer
    if (file.data instanceof File) {
      bufferData = Buffer.from(await file.data.arrayBuffer())
    } else {
      bufferData = file.data
    }

    // Calculate SHA-256 hash
    const hash = crypto.createHash('sha256').update(bufferData).digest('hex')

    // Duplicate detection
    const existing = await this.mediaRepository.findByContentHash(hash)
    if (existing) {
      return existing
    }

    const media = new MediaEntity()
    media.fileName = file.fileName
    media.mimeType = file.mimeType
    media.fileSize = file.fileSize
    media.data = bufferData
    media.contentHash = hash
    return this.mediaRepository.createAndSave(media)
  }

  /**
   * Delete an image by its ID.
   * @param id Media UUID
   * @returns true if deleted, false if not found
   */
  async deleteImage(id: string): Promise<boolean> {
    return this.mediaRepository.deleteById(id)
  }

  /**
   * Update image metadata.
   * @param id Media UUID
   * @param meta Metadata object containing fileName, alt, and tags
   * @returns Updated Media entity
   */
  async updateImageMeta(
    id: string,
    meta: { fileName: string; alt?: string; tags?: string[] }
  ) {
    const media = await this.mediaRepository.getById(id)
    if (!media) throw new Error('Media not found')
    const update: MediaUpdate = {
      ...media,
      fileName: meta.fileName,
      altText: meta.alt ?? (media as { altText?: string }).altText ?? '',
      tags: meta.tags ?? media.tags ?? []
    }
    return this.mediaRepository.createAndSave(update as MediaEntity)
  }

  // Additional CRUD methods (upload, delete, etc.) can be added here
}
