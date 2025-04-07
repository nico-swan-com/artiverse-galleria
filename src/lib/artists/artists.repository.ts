import { PaginationParams } from './../../types/common/pagination-params.type'
import {
  DeleteResult,
  FindOptionsOrderValue,
  Repository,
  UpdateResult
} from 'typeorm'
import { DatabaseRepository } from '../data-access'
import { Artist, Artists } from './model'

@DatabaseRepository(Artist, 'repository')
class ArtistsRepository {
  repository!: Repository<Artist>

  async getArtists(
    pagination: PaginationParams,
    sortBy: keyof Artist = 'createdAt',
    order: FindOptionsOrderValue = 'DESC'
  ): Promise<Artists> {
    const { page, limit } = pagination
    const skip = (page - 1) * limit
    try {
      const repository = await this.repository
      const [artists, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortBy]: order }
      })
      return { artists, total }
    } catch (error) {
      console.error('Error getting users:', error)
      return { artists: [], total: 0 }
    }
  }

  async getArtistById(id: string): Promise<Artist | null> {
    try {
      const repository = await this.repository
      const found = await repository.findOne({ where: { id } })
      return found
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }

  async create(artist: Artist): Promise<Artist> {
    try {
      const repository = await this.repository
      const created = await repository.save(artist)
      return created
    } catch (error) {
      console.error('Error creating artist:', error)
      throw error
    }
  }

  async update(artist: Artist): Promise<UpdateResult> {
    try {
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
