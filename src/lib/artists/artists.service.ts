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

// Helper to check if we're in build phase
const isBuildPhase = () =>
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE === 'phase-production-build'

export default class ArtistsService {
  private repository: ArtistsRepository

  constructor(repository: ArtistsRepository = artistsRepository) {
    this.repository = repository
  }

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

  async getById(id: string): Promise<Artist | null> {
    if (isBuildPhase()) {
      return null
    }

    return getArtistByIdCache(id)
  }

  async create(artist: ArtistCreate): Promise<Artist> {
    try {
      const result = await this.repository.create(artist)
      return result
    } catch (error) {
      console.error('Error creating artist:', error)
      throw error
    }
  }

  async update(artist: ArtistUpdate): Promise<void> {
    try {
      await this.repository.update(artist)
      return
    } catch (error) {
      console.error('Error updating artist:', error)
      throw error
    }
  }

  async delete(artistId: string): Promise<void> {
    try {
      await this.repository.delete(artistId)
      return
    } catch (error) {
      console.error('Error deleting artist:', error)
      throw error
    }
  }
}
