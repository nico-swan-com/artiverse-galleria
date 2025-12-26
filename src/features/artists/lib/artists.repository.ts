import { PaginationParams } from '@/types/common/pagination-params.type'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { ArtistCreate, Artists, ArtistsSortBy, ArtistUpdate } from '../types'
// Using Artist type from schema instead of entity class
import { Artist } from '../types/artist.schema'
import { db } from '@/lib/database/drizzle'
import { artists } from '@/lib/database/schema'
import { eq, desc, asc, count } from 'drizzle-orm'
import {
  validateSearchQuery,
  buildSearchFilter
} from '@/lib/utilities/search-query.util'
import {
  mapArtistsToAppType,
  mapArtistToAppType
} from '@/lib/database/mappers/artist.mapper'
import { logger } from '@/lib/utilities/logger'

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
        artists: mapArtistsToAppType(result),
        total: result.length
      }
    } catch (error) {
      logger.error('Error getting artists', error, { sortBy, order })
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

    // Validate and build search filter
    const validatedQuery = validateSearchQuery(searchQuery)
    const searchFilter = buildSearchFilter(validatedQuery, [
      artists.name,
      artists.specialization,
      artists.location
    ])

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
        artists: mapArtistsToAppType(data),
        total
      }
    } catch (error) {
      logger.error('Error getting paged artists', error, {
        pagination,
        sortBy,
        order,
        searchQuery
      })
      throw error // Let the service layer handle the error
    }
  }

  async getById(id: string): Promise<Artist | null> {
    try {
      const found = await db.query.artists.findFirst({
        where: eq(artists.id, id)
      })

      if (found) {
        return mapArtistToAppType(found)
      }

      return null
    } catch (error) {
      logger.error('Error getting artist by id', error, { id })
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

      return mapArtistToAppType(created)
    } catch (error) {
      logger.error('Error creating artist', error)
      throw error
    }
  }

  async update(artist: ArtistUpdate): Promise<void> {
    try {
      if (!artist.id) {
        throw new Error('Artist ID is required for update')
      }

      const { id, ...updateData } = artist
      type UpdateFields = Partial<Omit<ArtistUpdate, 'id'>>
      const definedUpdates: UpdateFields = {}
      for (const key in updateData) {
        const val = updateData[key as keyof typeof updateData]
        if (val !== undefined) {
          ;(definedUpdates as Record<string, unknown>)[key] = val
        }
      }
      definedUpdates.updatedAt = new Date()

      await db.update(artists).set(definedUpdates).where(eq(artists.id, id))

      return
    } catch (error) {
      logger.error('Error updating artist', error, { artistId: artist.id })
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(artists).where(eq(artists.id, id))
      return
    } catch (error) {
      logger.error('Error deleting artist', error, { id })
      throw error
    }
  }
}

const artistsRepository = new ArtistsRepository()

export { ArtistsRepository, artistsRepository }
