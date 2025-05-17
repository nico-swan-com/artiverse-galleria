import { z } from 'zod'

export const ArtistSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  photoUrl: z.string().url(),
  featured: z.boolean().default(false),
  styles: z.array(z.string()).default([]),
  biography: z
    .string()
    .min(10, 'Biography must be at least 10 characters')
    .max(5000, 'Biography is too long'),
  specialization: z
    .string()
    .min(1, 'Specialization is required')
    .max(100, 'Specialization is too long'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location is too long'),
  email: z.string().email(),
  website: z.string().optional().default('').pipe(z.string().url().optional()),
  exhibitions: z.array(z.string()).default([]),
  statement: z
    .string()
    .min(10, 'Statement must be at least 10 characters')
    .max(2000, 'Statement is too long'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
})

export type Artist = z.infer<typeof ArtistSchema>
export const ArtistListSchema = z.array(ArtistSchema)
export type ArtistList = z.infer<typeof ArtistListSchema>
export const ArtistCreateSchema = ArtistSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type ArtistCreate = z.infer<typeof ArtistCreateSchema>
export const ArtistUpdateSchema = ArtistSchema.partial().omit({
  createdAt: true
})
export type ArtistUpdate = z.infer<typeof ArtistUpdateSchema>
export const ArtistUpdatePartialSchema = ArtistSchema.partial()
export type ArtistUpdatePartial = z.infer<typeof ArtistUpdatePartialSchema>
export const ArtistUpdateListSchema = z.array(ArtistUpdateSchema)
export type ArtistUpdateList = z.infer<typeof ArtistUpdateListSchema>
export const ArtistUpdateListPartialSchema = z.array(ArtistUpdatePartialSchema)
export type ArtistUpdateListPartial = z.infer<
  typeof ArtistUpdateListPartialSchema
>
