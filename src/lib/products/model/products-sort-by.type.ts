export type ProductsSortBy =
  | 'id'
  | 'name'
  | 'description'
  | 'price'
  | 'stock'
  | 'sales'
  | 'category'
  | 'createdAt'
  | 'updatedAt'

// Helper function to validate sort keys
export function isValidProductsSortKey(key: string): key is ProductsSortBy {
  return [
    'id',
    'name',
    'description',
    'price',
    'stock',
    'sales',
    'category',
    'createdAt',
    'updatedAt'
  ].includes(key)
}
