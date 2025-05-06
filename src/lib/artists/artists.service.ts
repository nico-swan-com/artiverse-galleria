import { PaginationParams } from '../../types/common/pagination-params.type'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from 'typeorm'
import { ArtistsRepository } from './artists.repository'
import { Artist, Artists as ArtistsResult, ArtistsSortBy } from './model'

export default class Artists {
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

  async create(artist: Artist): Promise<Artist> {
    const result = await this.repository.create(artist)
    return result
  }

  async update(artist: Artist): Promise<void> {
    await this.repository.update(artist)
    return
  }

  async delete(artist: Artist): Promise<void> {
    await this.repository.delete(artist.id)
    return
  }
}
