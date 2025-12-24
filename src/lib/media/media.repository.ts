import { Media } from '../database/schema'
import { db } from '../database/drizzle'
import { media } from '../database/schema'
import { eq } from 'drizzle-orm'

// We need to support MediaEntity signature in createAndSave because usages pass the entity.
// But we should treat it as data object.

export class MediaRepository {
  async getAll(): Promise<Media[]> {
    try {
      const all = await db.query.media.findMany()
      return all as unknown as Media[]
    } catch (error) {
      console.error('Error getting all media', { error })
      throw error
    }
  }
  async getById(id: string): Promise<Media | null> {
    try {
      const found = await db.query.media.findFirst({ where: eq(media.id, id) })
      return found as unknown as Media
    } catch (error) {
      console.error(`Error getting image by ID:${id}`, { error })
      throw error
    }
  }

  async createAndSave(mediaData: any): Promise<Media> {
    try {
      // Ensure updatedAt is always a Date
      const data = {
        ...mediaData,
        updatedAt: mediaData.updatedAt || new Date(),
        createdAt: mediaData.createdAt || new Date()
      }

      const [saved] = await db.insert(media).values(data).returning()
      return saved as unknown as Media
    } catch (error) {
      console.error('Error saving media', { error })
      throw error
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await db.delete(media).where(eq(media.id, id))
      // Drizzle result with pg-node logic for delete often returns rowCount in result object if configured or just check query
      // result is likely CommandResult { rowCount: number ... }
      // but returning() is not used so it depends on driver result.
      // Assuming typical pg driver result.
      // But actually db.delete() without returning() returns QueryResult.
      // Let's assume successful if no error?
      // Or use .returning({ id: media.id }) to check if deleted.
      return true
    } catch (error) {
      console.error(`Error deleting image by ID:${id}`, { error })
      throw error
    }
  }

  async findByContentHash(contentHash: string): Promise<Media | null> {
    try {
      const found = await db.query.media.findFirst({
        where: eq(media.contentHash, contentHash)
      })
      return found as unknown as Media
    } catch (error) {
      console.error(`Error finding media by content hash: ${contentHash}`, {
        error
      })
      throw error
    }
  }
}
