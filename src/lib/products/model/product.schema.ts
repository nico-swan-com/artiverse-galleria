/**
 * Product Domain Schema
 *
 * Re-exports from the types directory for backwards compatibility.
 * In future refactoring, move the actual schema definitions here.
 */
export {
  ProductSchema,
  ProductListSchema,
  ProductCreateSchema,
  ProductUpdateSchema,
  ProductUpdatePartialSchema,
  ProductUpdateListSchema,
  ProductUpdateListPartialSchema,
  ProductDeleteSchema,
  type Product,
  type ProductList,
  type ProductCreate,
  type ProductUpdate,
  type ProductUpdatePartial,
  type ProductUpdateList,
  type ProductUpdateListPartial,
  type ProductDelete
} from '@/types/products/product.schema'
