import { artists } from '../schema'
import { Artist } from '@/features/artists/types/artist.schema'
import type { InferSelectModel } from 'drizzle-orm'

/**
 * Maps Drizzle artist result to application Artist type
 * Handles null to undefined conversion for optional fields
 */
export function mapArtistToAppType(
  artist: InferSelectModel<typeof artists>
): Artist {
  return {
    ...artist,
    website: artist.website ?? undefined,
    deletedAt: artist.deletedAt ?? undefined
  } as Artist
}

/**
 * Maps array of Drizzle artists to application Artist array
 */
export function mapArtistsToAppType(
  artistRows: InferSelectModel<typeof artists>[]
): Artist[] {
  return artistRows.map(mapArtistToAppType)
}
