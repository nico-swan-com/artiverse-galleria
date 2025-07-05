import { UserRoles, UserStatus } from '.'
import { z } from 'zod'

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
  avatar: z.string().url().optional(),
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
