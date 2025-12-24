import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from '../../types/common/db.type'
import { ArtistCreate, Artists, ArtistsSortBy, ArtistUpdate } from './model'
// Using Artist type from schema instead of entity class
import { Artist } from './model/artist.schema'
import { db } from '../database/drizzle'
import { artists } from '../database/schema'
import { eq, ilike, or, desc, asc, count } from 'drizzle-orm'

class ArtistsRepository {
  async getAll(
    sortBy: ArtistsSortBy = 'name',
    order: FindOptionsOrderValue = 'DESC'
  ): Promise<Artists> {
    try {
      const orderDir = order === 'DESC' ? desc : asc
      const result = await db.query.artists.findMany({
        orderBy: [orderDir(artists[sortBy])]
      })

      return {
        artists: result as unknown as Artist[],
        total: result.length
      }
    } catch (error) {
      console.error('Error getting artists:', error)
      throw error
    }
  }

  async getPaged(
    pagination: PaginationParams,
    sortBy: ArtistsSortBy = 'createdAt',
    order: FindOptionsOrderValue = 'DESC',
    searchQuery?: string
  ): Promise<Artists> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit
    const orderDir = order === 'DESC' ? desc : asc

    // Build where clause
    const searchFilter = searchQuery
      ? or(
          ilike(artists.name, `%${searchQuery}%`),
          ilike(artists.specialization, `%${searchQuery}%`),
          ilike(artists.location, `%${searchQuery}%`)
        )
      : undefined

    try {
      const data = await db.query.artists.findMany({
        where: searchFilter,
        limit: limit,
        offset: offset,
        orderBy: [orderDir(artists[sortBy])]
      })

      const rows = await db
        .select({ count: count() })
        .from(artists)
        .where(searchFilter)
      const total = rows[0].count

      return {
        artists: data as unknown as Artist[],
        total
      }
    } catch (error) {
      console.error('Error getting paged artists:', error)
      throw error // Let the service layer handle the error
    }
  }

  async getById(id: string): Promise<Artist | null> {
    try {
      const found = await db.query.artists.findFirst({
        where: eq(artists.id, id)
      })

      if (found) {
        return found as unknown as Artist
      }

      return null
    } catch (error) {
      console.error('Error getting artist by id:', error)
      throw error
    }
  }

  async create(artist: ArtistCreate): Promise<Artist> {
    try {
      const [created] = await db
        .insert(artists)
        .values({
          ...artist,
          website: artist.website ?? null // handle optional
        })
        .returning()

      return created as unknown as Artist
    } catch (error) {
      console.error('Error creating artist:', error)
      throw error
    }
  }

  async update(artist: ArtistUpdate): Promise<void> {
    try {
      if (!artist.id) {
        throw new Error('Artist ID is required for update')
      }

      const { id, ...updateData } = artist
      const definedUpdates: any = {}
      for (const key in updateData) {
        const val = (updateData as any)[key]
        if (val !== undefined) {
          definedUpdates[key] = val
        }
      }
      definedUpdates.updatedAt = new Date()

      await db.update(artists).set(definedUpdates).where(eq(artists.id, id))

      return
    } catch (error) {
      console.error('Error updating artist:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(artists).where(eq(artists.id, id))
      return
    } catch (error) {
      console.error('Error deleting artist:', error)
      throw error
    }
  }
}

const artistsRepository = new ArtistsRepository()

export { ArtistsRepository, artistsRepository }
