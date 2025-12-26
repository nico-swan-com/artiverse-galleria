import { PaginationParams } from '@/types'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { artistsRepository } from '../lib/artists.repository'
import { Artist, Artists as ArtistsResult, ArtistsSortBy } from '../types'

/**
 * Cached function to get all artists.
 * Defined at module level for consistent caching behavior.
 */
export const getAllArtistsCache = unstable_cache(
  async (
    sortBy: ArtistsSortBy,
    order: FindOptionsOrderValue
  ): Promise<ArtistsResult> => {
    const result = await artistsRepository.getAll(sortBy, order)
    return result
  },
  ['artists-all'],
  {
    tags: ['artists'],
    revalidate: 60
  }
)

/**
 * Cached function to get paginated artists.
 * Defined at module level for consistent caching behavior.
 */
export const getPagedArtistsCache = unstable_cache(
  async (
    pagination: PaginationParams,
    sortBy: ArtistsSortBy,
    order: FindOptionsOrderValue,
    searchQuery?: string
  ): Promise<ArtistsResult> => {
    const result = await artistsRepository.getPaged(
      pagination,
      sortBy,
      order,
      searchQuery
    )
    return result
  },
  ['artists-paged'],
  {
    tags: ['artists'],
    revalidate: 1
  }
)

/**
 * Cached function to get artist by ID.
 * Defined at module level for consistent caching behavior.
 */
export const getArtistByIdCache = unstable_cache(
  async (id: string): Promise<Artist | null> => {
    const result = await artistsRepository.getById(id)
    return result
  },
  ['artist-by-id'],
  {
    tags: ['artists'],
    revalidate: 60
  }
)
