'use server'

import { z } from 'zod'
import {
  PasswordSchema,
  UsersEntity,
  UserRoles,
  UserSchema,
  UserStatus
} from '@/lib/users'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import Users from '@/lib/users/users.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createUserAction(prevState: any, formData: FormData) {
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
    const values = UserSchema.parse({
      name,
      email,
      avatar: getAvatarUrl(email, name),
      role: UserRoles.Client,
      status: UserStatus.Pending
    })

    const user = new UsersEntity()
    const newPassword = PasswordSchema.parse(password)
    await user.setPassword(newPassword)

    user.name = name
    user.email = email
    user.avatar =
      typeof values.avatar === 'object' && values.avatar instanceof Buffer
        ? values.avatar
        : undefined
    user.role = values.role
    user.status = values.status

    const services = new Users()

    await services.create(user)
    revalidateTag('users')

    return { success: true, message: 'User created successfully!', ...state }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error. Please check the fields.',
        ...state,
        errors: error.flatten().fieldErrors
      }
    } else {
      console.error(error)
      return {
        success: false,
        message: 'Failed to create user.',
        ...state,
        errors: {
          database: [error.message]
        } as { [x: string]: string[] | undefined }
      }
    }
  }
}

export default createUserAction
