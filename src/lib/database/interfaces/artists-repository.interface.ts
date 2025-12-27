import { PaginationParams } from '../../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from '../../../types/common/db.type'
import {
  ArtistCreate,
  Artists,
  ArtistsSortBy,
  ArtistUpdate
} from '@/features/artists/types'
import { Artist } from '@/features/artists/types/artist.schema'

/**
 * Artists repository interface
 */
export interface IArtistsRepository {
  getAll(
    sortBy?: ArtistsSortBy,
    order?: FindOptionsOrderValue
  ): Promise<Artists>

  getPaged(
    pagination: PaginationParams,
    sortBy?: ArtistsSortBy,
    order?: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<Artists>

  getById(id: string): Promise<Artist | null>

  create(artist: ArtistCreate): Promise<Artist>

  update(artist: ArtistUpdate): Promise<void>

  delete(id: string): Promise<void>
}
