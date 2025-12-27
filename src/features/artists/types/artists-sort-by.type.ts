export type ArtistsSortBy =
  | 'id'
  | 'name'
  | 'featured'
  | 'specialization'
  | 'location'
  | 'email'
  | 'createdAt'
  | 'updatedAt'

// Helper function to validate sort keys
export function isValidArtistsSortKey(key: string): key is ArtistsSortBy {
  return [
    'id',
    'name',
    'featured',
    'specialization',
    'location',
    'email',
    'createdAt',
    'updatedAt'
  ].includes(key)
}
