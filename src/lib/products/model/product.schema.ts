import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  image: z.string().url('Image must be a valid URL'),
  price: z.number().min(0, 'Price must be a positive number'),
  stock: z.number().min(0, 'Stock must be a positive number'),
  sales: z.number().min(0, 'Sales must be a positive number'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long'),
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional()
})

export type Product = z.infer<typeof ProductSchema>
export const ProductListSchema = z.array(ProductSchema)
export type ProductList = z.infer<typeof ProductListSchema>
export const ProductCreateSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type ProductCreate = z.infer<typeof ProductCreateSchema>
export const ProductUpdateSchema = ProductSchema.partial().omit({
  createdAt: true
})
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>
export const ProductUpdatePartialSchema = ProductSchema.partial()
export type ProductUpdatePartial = z.infer<typeof ProductUpdatePartialSchema>
export const ProductUpdateListSchema = z.array(ProductUpdateSchema)
export type ProductUpdateList = z.infer<typeof ProductUpdateListSchema>
export const ProductUpdateListPartialSchema = z.array(
  ProductUpdatePartialSchema
)
export type ProductUpdateListPartial = z.infer<
  typeof ProductUpdateListPartialSchema
>
