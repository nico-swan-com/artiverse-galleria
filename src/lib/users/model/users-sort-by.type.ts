export type UsersSortBy =
  | 'id'
  | 'email'
  | 'name'
  | 'role'
  | 'status'
  | 'createdAt'
  | 'updatedAt'

// Helper function to validate sort keys
export function isValidUsersSortKey(key: string): key is UsersSortBy {
  return [
    'id',
    'name',
    'email',
    'role',
    'status',
    'createdAt',
    'updatedAt'
  ].includes(key)
}
