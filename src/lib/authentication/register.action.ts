'use server'

import { z } from 'zod'
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import { PasswordSchema, UserCreateSchema } from '@/types/users/user.schema'
import { getAvatarUrl } from '@/lib/utilities'
import { UsersRepository } from '@/lib/users/users.repository'
import bcrypt from 'bcryptjs'
import { NewUser } from '@/lib/database/schema'
import { signIn } from '@/lib/authentication'

export type RegisterFieldErrors = {
  name?: string[]
  email?: string[]
  password?: string[]
  general?: string[]
  [key: string]: string[] | undefined
}

export type RegisterState = {
  success: boolean
  message: string
  errors?: RegisterFieldErrors
}

async function registerAction(
  prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  try {
    // 1. Basic Schema Validation
    const basicValidation = UserCreateSchema.safeParse({
      name,
      email,
      avatar: getAvatarUrl(email, name),
      role: UserRoles.Client,
      status: UserStatus.Active // Active by default for instant access
    })

    if (!basicValidation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: basicValidation.error.flatten()
          .fieldErrors as RegisterFieldErrors
      }
    }

    // 2. Strong Password Validation
    const passwordResult = PasswordSchema.safeParse(password)
    if (!passwordResult.success) {
      return {
        success: false,
        message: 'Password does not meet requirements',
        errors: {
          password: passwordResult.error.errors.map((e) => e.message)
        }
      }
    }

    const usersRepo = new UsersRepository()

    // 3. Check for existing user
    const existingUser = await usersRepo.getUserByEmail(email)
    if (existingUser) {
      return {
        success: false,
        message: 'Email already in use',
        errors: {
          email: ['This email is already associated with an account.']
        }
      }
    }

    // 4. Create User
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser: NewUser = {
      name: name,
      email: email,
      avatar: basicValidation.data.avatar,
      role: UserRoles.Client,
      status: UserStatus.Active, // Using Active so they can login immediately
      password: hashedPassword
    }

    await usersRepo.create(newUser)

    return {
      success: true,
      message: 'Registration successful! Redirecting...'
    }
  } catch (error: unknown) {
    console.error('Registration error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: {
        general: ['System error occurred.']
      }
    }
  }
}

export default registerAction
