import { z } from 'zod'
import { ArtistSchema } from '@/lib/artists/model/artist.schema'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  sku: z.number().int().positive().optional(),
  title: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(500, 'Description is too long'),
  featureImage: z.string().url().or(z.instanceof(File)).optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  stock: z.number().min(0, 'Stock must be a positive number'),
  sales: z.number().min(0, 'Sales must be a positive number'),
  productType: z.string().min(1).max(50).default('physical'),
  artistId: z.string().uuid().optional(),
  images: z.array(z.string().or(z.instanceof(File))).optional(),
  yearCreated: z.number().int().optional(),
  medium: z.string().max(100).optional(),
  dimensions: z.string().max(100).optional(),
  weight: z.string().max(50).optional(),
  style: z.string().max(50).optional(),
  featured: z.boolean().default(false),
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
    .optional(),
  artist: ArtistSchema.optional()
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
export const ProductDeleteSchema = ProductSchema.pick({
  id: true,
  title: true,
  description: true
})
export type ProductDelete = z.infer<typeof ProductDeleteSchema>
