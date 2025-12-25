'use server'

import { z } from 'zod'
// import { UsersEntity } from '@/lib/users/model' // Remove entity import
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import { PasswordSchema, UserCreateSchema } from '@/types/users/user.schema'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag, revalidatePath } from 'next/cache'
import Users from '@/lib/users/users.service'
import bcrypt from 'bcryptjs'
import { NewUser } from '@/lib/database/schema'

export type CreateUserFieldErrors = {
  name?: string[]
  email?: string[]
  password?: string[]
  database?: string[]
  [key: string]: string[] | undefined
}

export type CreateUserState = {
  success: boolean
  message: string
  name: string
  email: string
  errors: CreateUserFieldErrors
}

async function createUserAction(
  prevState: CreateUserState | undefined,
  formData: FormData
): Promise<CreateUserState> {
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''
  const state = {
    name,
    email,
    errors: {
      name: [],
      email: [],
      password: [],
      database: []
    } as {
      [x: string]: string[] | undefined
      [x: number]: string[] | undefined
      [x: symbol]: string[] | undefined
    }
  }
  try {
    const values = UserCreateSchema.parse({
      name,
      email,
      avatar: getAvatarUrl(email, name),
      role: UserRoles.Client,
      status: UserStatus.Pending
    })

    // Validate password separately with safeParse for better error handling
    const passwordResult = PasswordSchema.safeParse(password)
    if (!passwordResult.success) {
      return {
        success: false,
        message: '', // No message needed - UI indicator shows requirements
        ...state,
        errors: {
          password: passwordResult.error.errors.map((e) => e.message)
        }
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(passwordResult.data, salt)

    const user: NewUser = {
      name: name,
      email: email,
      avatar: values.avatar ?? null,
      role: values.role,
      status: values.status,
      password: hashedPassword
    }

    const services = new Users()

    await services.create(user)
    revalidateTag('users', 'default')
    revalidatePath('/admin/users')

    return { success: true, message: 'User created successfully!', ...state }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error. Please check the fields.',
        ...state,
        errors: error.flatten().fieldErrors as CreateUserFieldErrors
      }
    } else {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        message: 'Failed to create user.',
        ...state,
        errors: {
          database: [errorMessage]
        }
      }
    }
  }
}

export default createUserAction
