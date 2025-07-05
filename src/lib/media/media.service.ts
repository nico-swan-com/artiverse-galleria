import { MediaRepository } from './media.repository'
import { Media, MediaCreate } from './model/media.schema'
import { MediaEntity } from './model/media.entity'

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

    let bufferData: Buffer
    if (file.data instanceof File) {
      bufferData = Buffer.from(await file.data.arrayBuffer())
    } else {
      bufferData = file.data
    }
    const media = new MediaEntity()
    media.fileName = file.fileName
    media.mimeType = file.mimeType
    media.fileSize = file.fileSize
    media.data = bufferData
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

  // Additional CRUD methods (upload, delete, etc.) can be added here
}
