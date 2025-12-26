import { z } from 'zod'

export const MediaSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  mimeType: z.string().max(50, 'Description is too long'),
  data: z.instanceof(Buffer), // Only Buffer allowed
  fileSize: z.number().min(0, 'Price must be a positive number'),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  contentHash: z.string().max(64).optional(),
  tags: z.array(z.string()).optional(),
  altText: z.string().optional()
})

export type Media = z.infer<typeof MediaSchema>
export const MediaListSchema = z.array(MediaSchema)
export type MediaList = z.infer<typeof MediaListSchema>
export const MediaCreateSchema = MediaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type MediaCreate = z.infer<typeof MediaCreateSchema>
export const MediaUpdateSchema = MediaSchema.partial().omit({
  createdAt: true,
  updatedAt: true
})
export type MediaUpdate = z.infer<typeof MediaUpdateSchema>
export const MediaUpdatePartialSchema = MediaSchema.partial()
export type MediaUpdatePartial = z.infer<typeof MediaUpdatePartialSchema>
export const MediaUpdateListSchema = z.array(MediaUpdateSchema)
export type MediaUpdateList = z.infer<typeof MediaUpdateListSchema>
export const MediaUpdateListPartialSchema = z.array(MediaUpdatePartialSchema)
export type MediaUpdateListPartial = z.infer<
  typeof MediaUpdateListPartialSchema
>
export const MediaDeleteSchema = MediaSchema.pick({
  id: true,
  fileName: true,
  mimeType: true,
  fileSize: true
})
export type MediaDelete = z.infer<typeof MediaDeleteSchema>
