import { getRepository } from '../database'
import { MediaEntity } from './model/media.entity'
import { Media } from './model/media.schema'

export class MediaRepository {
  async getAll(): Promise<Media[]> {
    try {
      const repository = await getRepository(MediaEntity)
      const all = await repository.find()
      return all as Media[]
    } catch (error) {
      console.error('Error getting all media', { error })
      throw error
    }
  }
  async getById(id: string): Promise<Media | null> {
    try {
      const repository = await getRepository(MediaEntity)
      const media = await repository.findOne({ where: { id } })
      return media as Media
    } catch (error) {
      console.error(`Error getting image by ID:${id}`, { error })
      throw error
    }
  }

  async createAndSave(media: MediaEntity): Promise<Media> {
    try {
      // Ensure updatedAt is always a Date
      if (!media.updatedAt || typeof media.updatedAt !== 'object') {
        media.updatedAt = new Date()
      }
      const repository = await getRepository(MediaEntity)
      const saved = await repository.save(media)
      return saved as Media
    } catch (error) {
      console.error('Error saving media', { error })
      throw error
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const repository = await getRepository(MediaEntity)
      const result = await repository.delete(id)
      return result.affected !== 0
    } catch (error) {
      console.error(`Error deleting image by ID:${id}`, { error })
      throw error
    }
  }

  async findByContentHash(contentHash: string): Promise<Media | null> {
    try {
      const repository = await getRepository(MediaEntity)
      const media = await repository.findOne({ where: { contentHash } })
      return media as Media
    } catch (error) {
      console.error(`Error finding media by content hash: ${contentHash}`, {
        error
      })
      throw error
    }
  }
}
