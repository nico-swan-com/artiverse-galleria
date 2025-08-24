export type ProductsSortBy =
  | 'id'
  | 'title'
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
    'title',
    'description',
    'price',
    'stock',
    'sales',
    'category',
    'createdAt',
    'updatedAt'
  ].includes(key)
}
