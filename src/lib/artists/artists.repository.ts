import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue, ILike } from 'typeorm'
import {
  Artist,
  ArtistCreate,
  Artists,
  ArtistsSortBy,
  ArtistUpdate
} from './model'
import { getRepository } from '../database'

class ArtistsRepository {
  async getAll(
    sortBy: ArtistsSortBy = 'name',
    order: FindOptionsOrderValue = 'DESC'
  ): Promise<Artists> {
    try {
      const repository = await getRepository(Artist)

      const [artists, total] = await repository.findAndCount({
        order: { [sortBy]: order }
      })

      return {
        artists: artists as Artist[],
        total
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
    const skip = (page - 1) * limit

    try {
      const repository = await getRepository(Artist)

      const searchFilter = searchQuery
        ? {
            where: [
              { name: ILike(`%${searchQuery}%`) },
              { specialization: ILike(`%${searchQuery}%`) },
              { location: ILike(`%${searchQuery}%`) }
            ]
          }
        : undefined

      const [artists, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortBy]: order },
        where: searchFilter?.where
      })

      return {
        artists: artists as Artist[],
        total
      }
    } catch (error) {
      console.error('Error getting paged artists:', error)
      throw error // Let the service layer handle the error
    }
  }

  async getById(id: string): Promise<Artist | null> {
    try {
      const repository = await getRepository(Artist)

      const found = await repository.findOne({
        where: { id }
      })

      if (found) {
        return found as Artist
      }

      return null
    } catch (error) {
      console.error('Error getting artist by id:', error)
      throw error
    }
  }

  async create(artist: ArtistCreate): Promise<Artist> {
    try {
      const repository = await getRepository(Artist)

      const created = await repository.save(artist as Partial<Artist>)

      return created as Artist
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

      const repository = await getRepository(Artist)

      await repository.update(artist.id, artist as Partial<Artist>)

      return
    } catch (error) {
      console.error('Error updating artist:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const repository = await getRepository(Artist)

      await repository.delete(id)

      return
    } catch (error) {
      console.error('Error deleting artist:', error)
      throw error
    }
  }
}

const artistsRepository = new ArtistsRepository()

export { ArtistsRepository, artistsRepository }
