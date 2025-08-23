import { ACCEPTED_IMAGE_TYPES } from '@/lib/media'
import { UserRoles, UserStatus } from '.'
import { z } from 'zod'

const AVATAR_MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

export const PasswordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters.' })
  .max(20, { message: 'Password must be less 20 characters.' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'No uppercase characters.'
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'No lowercase characters.'
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'No number characters.'
  })
  .refine((password) => /[!@#$%^&*()_+\-=`~[\]{}|;:'",.<>?/]/.test(password), {
    message: 'No special characters.'
  })

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    password: PasswordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match.',
    path: ['confirmPassword']
  })

export const UserSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID.' }).optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().optional(),
  role: z
    .nativeEnum(UserRoles, { message: 'Missing user role.' })
    .optional()
    .default(UserRoles.Client),
  status: z
    .nativeEnum(UserStatus, { message: 'Missing user status.' })
    .optional()
    .default(UserStatus.Pending),
  avatar: z.string().optional(),
  avatarFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size === 0 || file.size <= AVATAR_MAX_FILE_SIZE,
      `Max file size is 1MB.`
    )
    .refine(
      (file) =>
        !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  createdAt: z.date().transform((date) => date || undefined),
  updatedAt: z
    .date()
    .optional()
    .transform((date) => date || undefined),
  deletedAt: z
    .date()
    .optional()
    .transform((date) => date || undefined)
})

export type User = z.infer<typeof UserSchema>
export const UserListSchema = z.array(UserSchema)
export type UserList = z.infer<typeof UserListSchema>
export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type UserCreate = z.infer<typeof UserCreateSchema>
export const UserUpdateSchema = UserSchema.partial().omit({
  createdAt: true
})
export type UserUpdate = z.infer<typeof UserUpdateSchema>
export const UserUpdatePartialSchema = UserSchema.partial()
export type UserUpdatePartial = z.infer<typeof UserUpdatePartialSchema>
export const UserUpdateListSchema = z.array(UserUpdateSchema)
export type UserUpdateList = z.infer<typeof UserUpdateListSchema>
export const UserUpdateListPartialSchema = z.array(UserUpdatePartialSchema)
export type UserUpdateListPartial = z.infer<typeof UserUpdateListPartialSchema>
