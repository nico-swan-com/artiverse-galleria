import { PaginationParams } from './../../types/common/pagination-params.type'
import { instanceToPlain } from 'class-transformer'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from 'typeorm'
import { artistsRepository, ArtistsRepository } from './artists.repository'
import { Artist } from './model'

export default class Artists {
  repository: ArtistsRepository

  constructor() {
    this.repository = artistsRepository
  }

  async getArtists(
    pagination: PaginationParams,
    sortBy: keyof Artist,
    order: FindOptionsOrderValue
  ) {
    const repository = new ArtistsRepository()
    const result = await repository.getArtists(pagination, sortBy, order)
    return result
  }

  async create(user: Artist) {
    const repository = new ArtistsRepository()
    const result = await repository.create(user)
    return result
  }

  async update(user: Artist) {
    const repository = new ArtistsRepository()
    const result = await repository.update(user)
    return result
  }

  async delete(user: Artist) {
    const repository = new ArtistsRepository()
    const result = await repository.delete(user.id)
    return result
  }
}

export const getArtistsUnstableCache = unstable_cache(
  async (
    pagination: PaginationParams,
    sortBy: keyof Artist,
    order: FindOptionsOrderValue
  ) => {
    const result = new Artists().getArtists(pagination, sortBy, order)
    return instanceToPlain(result)
  },
  ['users'],
  {
    tags: ['users'],
    revalidate: 1
  }
)

export const createArtistUnstableCache = unstable_cache(
  async (user: Artist) => {
    const result = new Artists().create(user)
    return instanceToPlain(result)
  },
  ['users'],
  {
    tags: ['users']
  }
)
