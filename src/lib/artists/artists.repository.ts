import { PaginationParams } from './../../types/common/pagination-params.type'
import {
  DeleteResult,
  FindOptionsOrderValue,
  ILike,
  Repository,
  UpdateResult
} from 'typeorm'
import { DatabaseRepository } from '../data-access'
import {
  Artist,
  ArtistCreate,
  Artists,
  ArtistsSortBy,
  ArtistUpdate
} from './model'
import { plainToInstance } from 'class-transformer'

@DatabaseRepository(Artist, 'repository')
class ArtistsRepository {
  /**
   * Injected by `@DatabaseRepository`.
   * The decorator returns a Promise that resolves to the actual repository.
   */
  repository!: Promise<Repository<Artist>>

  async getAll(
    sortBy: keyof Artist = 'name',
    order: FindOptionsOrderValue = 'DESC',
    searchQuery?: string
  ) {
    try {
      const repository = await this.repository
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
        order: { [sortBy]: order },
        where: searchFilter?.where
      })
      return { artists: plainToInstance(Artist, artists), total }
    } catch (error) {
      console.error('Error getting artists:', error)
      return { artists: [], total: 0 }
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
    const searchFilter = searchQuery
      ? {
          where: [
            { name: ILike(`%${searchQuery}%`) },
            { specialization: ILike(`%${searchQuery}%`) },
            { location: ILike(`%${searchQuery}%`) }
          ]
        }
      : undefined
    try {
      const repository = await this.repository
      const [artists, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortBy]: order },
        where: searchFilter?.where
      })
      return { artists: plainToInstance(Artist, artists), total }
    } catch (error) {
      console.error('Error getting artists:', error)
      return { artists: [], total: 0 }
    }
  }

  async getById(id: string): Promise<Artist | null> {
    try {
      const repository = await this.repository
      const found = await repository.findOne({ where: { id } })
      return found ? plainToInstance(Artist, found) : null
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }

  async create(artist: ArtistCreate): Promise<Artist> {
    try {
      const repository = await this.repository
      const created = await repository.save(artist)
      return created
    } catch (error) {
      console.error('Error creating artist:', error)
      throw error
    }
  }

  async update(artist: ArtistUpdate): Promise<UpdateResult> {
    try {
      if (!artist.id) throw new Error('Artist ID is required for update')
      console.log('Updating artist:', artist)
      const repository = await this.repository
      const updated = await repository.update(artist.id, artist)
      return updated
    } catch (error) {
      console.error('Error updating artist:', error)
      throw error
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const repository = await this.repository
      const deleted = await repository.delete(id)
      return deleted
    } catch (error) {
      console.error('Error deleting artist:', error)
      throw error
    }
  }
}

const artistsRepository = new ArtistsRepository()

export { ArtistsRepository, artistsRepository }
