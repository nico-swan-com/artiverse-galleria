import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue, ILike } from 'typeorm'
import {
  Artist,
  ArtistCreate,
  Artists,
  ArtistsEntity,
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
      const repository = await getRepository(ArtistsEntity)
      console.debug('Getting repository for getAll query')

      console.debug('Executing findAndCount query', {
        sortBy,
        order
      })

      const [artists, total] = await repository.findAndCount({
        order: { [sortBy]: order }
      })

      console.debug(`Found ${artists.length} artists out of ${total} total`)

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
      const repository = await getRepository(ArtistsEntity)
      console.debug('Getting repository for paged query')

      const searchFilter = searchQuery
        ? {
            where: [
              { name: ILike(`%${searchQuery}%`) },
              { specialization: ILike(`%${searchQuery}%`) },
              { location: ILike(`%${searchQuery}%`) }
            ]
          }
        : undefined

      console.debug('Executing paged findAndCount query', {
        skip,
        limit,
        sortBy,
        order,
        searchFilter: searchFilter?.where
      })

      const [artists, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortBy]: order },
        where: searchFilter?.where
      })

      console.debug(`Found ${artists.length} artists out of ${total} total`)

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
      const repository = await getRepository(ArtistsEntity)
      console.debug(`Getting artist by id: ${id}`)

      const found = await repository.findOne({
        where: { id },
        cache: true
      })

      if (found) {
        console.debug('Artist found, transforming result')
        return found as Artist
      }

      console.debug('No artist found with the given id')
      return null
    } catch (error) {
      console.error('Error getting artist by id:', error)
      throw error
    }
  }

  async create(artist: ArtistCreate): Promise<Artist> {
    try {
      const repository = await getRepository(ArtistsEntity)
      console.debug('Creating new artist', { artist })

      if (artist.image instanceof File) {
        const arrayBuffer = await artist.image.arrayBuffer()
        artist.image = Buffer.from<ArrayBuffer>(arrayBuffer)
      } else if (artist.image instanceof ArrayBuffer) {
        artist.image = Buffer.from(artist.image)
      }

      const created = await repository.save(artist as Partial<ArtistsEntity>)
      console.debug('Artist created successfully', { id: created.id })

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

      const repository = await getRepository(ArtistsEntity)
      console.debug('Updating artist', { id: artist.id })

      if (artist.image instanceof File) {
        const arrayBuffer = await artist.image.arrayBuffer()
        artist.image = Buffer.from<ArrayBuffer>(arrayBuffer)
      } else if (artist.image instanceof ArrayBuffer) {
        artist.image = Buffer.from(artist.image)
      }

      await repository.update(artist.id, artist as Partial<ArtistsEntity>)
      console.debug('Artist updated successfully', { id: artist.id })

      return
    } catch (error) {
      console.error('Error updating artist:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const repository = await getRepository(ArtistsEntity)
      console.debug(`Deleting artist with id: ${id}`)

      await repository.delete(id)
      console.debug('Artist deleted successfully', { id })

      return
    } catch (error) {
      console.error('Error deleting artist:', error)
      throw error
    }
  }
}

const artistsRepository = new ArtistsRepository()

export { ArtistsRepository, artistsRepository }
