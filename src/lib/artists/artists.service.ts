import { PaginationParams } from '../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from '../../types/common/db.type'
import { artistsRepository, ArtistsRepository } from './artists.repository'
import {
  Artist,
  ArtistCreate,
  Artists as ArtistsResult,
  ArtistsSortBy,
  ArtistUpdate
} from './model'
import {
  getAllArtistsCache,
  getPagedArtistsCache,
  getArtistByIdCache
} from './artists.actions'
import { isBuildPhase } from '../utilities/build-phase.util'
import { logger } from '../utilities/logger'

/**
 * ArtistsService handles business logic for artist operations
 * Provides caching, build-phase handling, and delegates to repository
 */
export default class ArtistsService {
  private repository: ArtistsRepository

  /**
   * Creates a new ArtistsService instance
   * @param repository - Optional ArtistsRepository instance for dependency injection
   */
  constructor(repository: ArtistsRepository = artistsRepository) {
    this.repository = repository
  }

  /**
   * Get all artists with sorting
   * @param sortBy - Field to sort by
   * @param order - Sort order (ASC or DESC)
   * @returns Artists with total count
   */
  async getAll(
    sortBy: ArtistsSortBy,
    order: FindOptionsOrderValue
  ): Promise<ArtistsResult> {
    if (isBuildPhase()) {
      return { artists: [], total: 0 }
    }

    return getAllArtistsCache(sortBy, order)
  }

  async getPaged(
    pagination: PaginationParams,
    sortBy: ArtistsSortBy,
    order: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<ArtistsResult> {
    if (isBuildPhase()) {
      return { artists: [], total: 0 }
    }

    return getPagedArtistsCache(pagination, sortBy, order, searchQuery)
  }

  /**
   * Get a single artist by ID
   * @param id - Artist ID
   * @returns Artist or null if not found
   */
  async getById(id: string): Promise<Artist | null> {
    if (isBuildPhase()) {
      return null
    }

    return getArtistByIdCache(id)
  }

  /**
   * Create a new artist
   * @param artist - Artist creation data
   * @returns Created artist
   */
  async create(artist: ArtistCreate): Promise<Artist> {
    try {
      const result = await this.repository.create(artist)
      return result
    } catch (error) {
      logger.error('Error creating artist', error)
      throw error
    }
  }

  /**
   * Update an existing artist
   * @param artist - Artist update data (must include id)
   */
  async update(artist: ArtistUpdate): Promise<void> {
    try {
      await this.repository.update(artist)
      return
    } catch (error) {
      logger.error('Error updating artist', error, { artistId: artist.id })
      throw error
    }
  }

  /**
   * Delete an artist by ID
   * @param artistId - Artist ID to delete
   */
  async delete(artistId: string): Promise<void> {
    try {
      await this.repository.delete(artistId)
      return
    } catch (error) {
      logger.error('Error deleting artist', error, { artistId })
      throw error
    }
  }
}
