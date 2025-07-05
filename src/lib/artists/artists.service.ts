import { PaginationParams } from '../../types/common/pagination-params.type'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from 'typeorm'
import { ArtistsRepository } from './artists.repository'
import {
  Artist,
  ArtistCreate,
  Artists as ArtistsResult,
  ArtistsSortBy,
  ArtistUpdate
} from './model'

export default class ArtistsService {
  repository: ArtistsRepository

  constructor() {
    this.repository = new ArtistsRepository()
  }

  async getAll(
    sortBy: ArtistsSortBy,
    order: FindOptionsOrderValue
  ): Promise<ArtistsResult> {
    const tag = `artists-${sortBy}-${order}`
    const getAll = unstable_cache(
      async (
        sortBy: ArtistsSortBy,
        order: FindOptionsOrderValue
      ): Promise<ArtistsResult> => {
        const result = await this.repository.getAll(sortBy, order)
        return result
      },
      [tag],
      {
        tags: [tag, 'artists']
      }
    )
    return getAll(sortBy, order)
  }

  async getPaged(
    pagination: PaginationParams,
    sortBy: ArtistsSortBy,
    order: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<ArtistsResult> {
    const tag = `artists-page-${pagination.page}-limit-${pagination.limit}-${sortBy}-${order}`
    const getPaged = unstable_cache(
      async (
        pagination: PaginationParams,
        sortBy: ArtistsSortBy,
        order: FindOptionsOrderValue,
        searchQuery?: string
      ): Promise<ArtistsResult> => {
        const result = await this.repository.getPaged(
          pagination,
          sortBy,
          order,
          searchQuery
        )
        return result
      },
      [tag],
      {
        tags: [tag, 'artists'],
        revalidate: 1
      }
    )
    return getPaged(pagination, sortBy, order, searchQuery)
  }

  async getById(id: string): Promise<Artist | null> {
    const tag = `artist-${id}`
    const getById = unstable_cache(
      async (id: string): Promise<Artist | null> => {
        const result = await this.repository.getById(id)
        return result
      },
      [tag],
      {
        tags: [tag, 'artists']
      }
    )
    return getById(id)
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
