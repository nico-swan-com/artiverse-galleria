import { MediaRepository } from './media.repository'
import { Media } from './model/media.schema'
import { MediaEntity } from './model/media.entity'

export class MediaService {
  private mediaRepository: MediaRepository

  constructor() {
    this.mediaRepository = new MediaRepository()
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
  async uploadImage(
    fileName: string,
    mimeType: string,
    fileSize: number,
    data: Buffer
  ): Promise<Media> {
    const media = new MediaEntity()
    media.fileName = fileName
    media.mimeType = mimeType
    media.fileSize = fileSize
    media.data = data
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
