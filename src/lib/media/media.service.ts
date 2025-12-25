import { MediaRepository } from './media.repository'
import { MediaCreate, MediaUpdate } from './model/media.schema'
import { Media, NewMedia } from '../database/schema'
import { FILE_CONFIG } from '../constants/app.constants'
import { MediaValidator } from './media-validator'
import { MediaHasher } from './media-hasher'
import { logger } from '../utilities/logger'
import {
  ValidationError,
  NotFoundError
} from '../utilities/error-handler.service'

export class MediaService {
  private mediaRepository: MediaRepository

  constructor(mediaRepository?: MediaRepository) {
    this.mediaRepository = mediaRepository || new MediaRepository()
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
   * @param file - Media file data
   * @returns The created Media entity
   */
  async uploadImage(file: MediaCreate): Promise<Media> {
    // Validate file
    MediaValidator.validateMediaFile(file)

    // Convert to buffer if needed
    let bufferData: Buffer
    if (file.data instanceof File) {
      bufferData = Buffer.from(await file.data.arrayBuffer())
    } else {
      bufferData = file.data
    }

    // Calculate hash for duplicate detection
    const hash = await MediaHasher.calculateHash(bufferData)

    // Check for duplicates
    const existing = await this.mediaRepository.findByContentHash(hash)
    if (existing) {
      logger.info('Duplicate media file detected, returning existing', {
        hash,
        fileName: file.fileName
      })
      return existing
    }

    // Create new media record
    const newMedia: NewMedia = {
      fileName: file.fileName,
      mimeType: file.mimeType,
      fileSize: file.fileSize,
      data: bufferData,
      contentHash: hash
    }

    return this.mediaRepository.createAndSave(newMedia)
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
   * @param id - Media UUID
   * @param meta - Metadata object containing fileName, alt, and tags
   * @returns Updated Media entity
   */
  async updateImageMeta(
    id: string,
    meta: { fileName: string; alt?: string; tags?: string[] }
  ): Promise<Media> {
    const media = await this.mediaRepository.getById(id)
    if (!media) {
      throw new NotFoundError('Media', id)
    }

    // Validate fileName
    if (!meta.fileName || meta.fileName.trim().length === 0) {
      throw new ValidationError('File name is required', 'fileName')
    }

    // Update media metadata
    const updated = await this.mediaRepository.update(id, {
      fileName: meta.fileName,
      altText: meta.alt ?? media.altText ?? '',
      tags: meta.tags ?? media.tags ?? []
    })

    if (!updated) {
      throw new NotFoundError('Media', id)
    }

    return updated
  }
  /**
   * Upload or replace a user avatar.
   * Checks for existing media with same fileName and 'user avatar' tag.
   * If found, overwrites it. Otherwise creates new (ignoring hash duplicates to ensure naming).
   */
  async uploadOrReplaceUserAvatar(file: MediaCreate): Promise<Media> {
    // Validate file
    MediaValidator.validateMediaFile(file)

    // Convert to buffer if needed
    let bufferData: Buffer
    if (file.data instanceof File) {
      bufferData = Buffer.from(await file.data.arrayBuffer())
    } else {
      bufferData = file.data
    }

    // Calculate hash
    const hash = await MediaHasher.calculateHash(bufferData)

    // Check for existing by name and tag
    const existing = await this.mediaRepository.findByNameAndTag(
      file.fileName,
      'user avatar'
    )

    if (existing) {
      // Update
      const updated = await this.mediaRepository.update(existing.id, {
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
        data: bufferData,
        contentHash: hash,
        altText: file.altText,
        tags: file.tags
      })
      if (!updated) {
        throw new NotFoundError('Media', existing.id)
      }
      return updated
    }

    // Create new
    const newMedia: NewMedia = {
      fileName: file.fileName,
      mimeType: file.mimeType,
      fileSize: file.fileSize,
      data: bufferData,
      contentHash: hash,
      altText: file.altText,
      tags: file.tags
    }
    return this.mediaRepository.createAndSave(newMedia)
  }
  /**
   * Process and upload a raw File.
   * @param file - The standard File object
   * @param tag - Optional tag to add to the media
   * @returns Object containing the uploaded Media entity and its URL
   */
  async processAndUploadImage(
    file: File,
    tag?: string
  ): Promise<{ url: string; media: Media }> {
    const buffer = Buffer.from(await file.arrayBuffer())

    const mediaCreate: MediaCreate = {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      data: buffer,
      tags: tag ? [tag] : undefined
    }

    const media = await this.uploadImage(mediaCreate)

    return {
      url: `/api/media/${media.id}`,
      media
    }
  }
}
