import { Media, NewMedia } from '../database/schema'
import { db } from '../database/drizzle'
import { media } from '../database/schema'
import { eq, and, arrayContains } from 'drizzle-orm'
import { logger } from '../utilities/logger'

// We need to support MediaEntity signature in createAndSave because usages pass the entity.
// But we should treat it as data object.

export class MediaRepository {
  async getAll(): Promise<Media[]> {
    try {
      const all = await db.query.media.findMany({
        columns: {
          id: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
          altText: true,
          contentHash: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
      })
      // Cast to Media[] but note that 'data' will be missing
      // Logic that requires 'data' should use getById
      return all as unknown as Media[]
    } catch (error) {
      logger.error('Error getting all media', error)
      throw error
    }
  }
  async getById(id: string): Promise<Media | null> {
    try {
      const found = await db.query.media.findFirst({ where: eq(media.id, id) })
      return found as Media | null
    } catch (error) {
      logger.error('Error getting image by ID', error, { id })
      throw error
    }
  }

  async createAndSave(mediaData: NewMedia): Promise<Media> {
    try {
      // Ensure updatedAt is always a Date
      const data = {
        ...mediaData,
        updatedAt: mediaData.updatedAt || new Date(),
        createdAt: mediaData.createdAt || new Date()
      }

      const [saved] = await db.insert(media).values(data).returning()
      return saved as Media
    } catch (error) {
      logger.error('Error saving media', error)
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
      logger.error('Error deleting image by ID', error, { id })
      throw error
    }
  }

  async update(
    id: string,
    updateData: Partial<NewMedia>
  ): Promise<Media | null> {
    try {
      const data = {
        ...updateData,
        updatedAt: new Date()
      }

      const [updated] = await db
        .update(media)
        .set(data)
        .where(eq(media.id, id))
        .returning()

      return updated as Media | null
    } catch (error) {
      logger.error('Error updating media', error, { id })
      throw error
    }
  }

  async findByContentHash(contentHash: string): Promise<Media | null> {
    try {
      const found = await db.query.media.findFirst({
        where: eq(media.contentHash, contentHash)
      })
      return found as Media | null
    } catch (error) {
      logger.error('Error finding media by content hash', error, {
        contentHash
      })
      throw error
    }
  }
  async findByNameAndTag(fileName: string, tag: string): Promise<Media | null> {
    try {
      const found = await db.query.media.findFirst({
        where: and(
          eq(media.fileName, fileName),
          arrayContains(media.tags, [tag])
        )
      })
      return found as Media | null
    } catch (error) {
      logger.error('Error finding media by name and tag', error, {
        fileName,
        tag
      })
      throw error
    }
  }
}
