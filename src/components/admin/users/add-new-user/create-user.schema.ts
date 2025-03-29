import { UserRoles, UserStatus } from '@/lib/users'
import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters.' })
  .max(20, { message: 'Password must be less 20 characters.' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must have be at least one uppercase characters.'
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must have be at least one lowercase characters.'
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must have be at least one number characters.'
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: 'Password must have be at least one special characters.'
  })

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match.',
    path: ['confirmPassword']
  })

export const CreateUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: passwordSchema,
  role: z.nativeEnum(UserRoles).optional().default(UserRoles.Client),
  status: z.nativeEnum(UserStatus).optional().default(UserStatus.Pending),
  avatar: z.string().optional().default('/placeholder.svg')
})
