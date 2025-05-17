'use server'

import { z } from 'zod'
import { PasswordSchema, User, UserSchema, UsersRepository } from '@/lib/users'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'

export type EditUserFieldErrors = {
  id?: string[]
  name?: string[]
  email?: string[]
  password?: string[]
  newPassword?: string[]
  role?: string[]
  status?: string[]
  database?: string[]
}

export type EditUserState = {
  id: string
  success: boolean
  message: string
  name: string
  email: string
  password: string
  newPassword: string
  role: string
  status: string
  errors: EditUserFieldErrors
}

async function editUserAction(
  prevState: EditUserState,
  formData: FormData
): Promise<EditUserState> {
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const newPassword = formData.get('newPassword')?.toString() || ''
  const password = !!newPassword
    ? PasswordSchema.parse(newPassword)
    : prevState.password
  const avatar = formData.get('avatar')?.toString() || getAvatarUrl(email, name)

  const state: EditUserState = {
    id: prevState.id,
    success: false,
    message: '',
    name,
    email,
    password,
    newPassword,
    role: prevState.role || '',
    status: prevState.status || '',
    errors: {}
  }

  try {
    const values = UserSchema.parse({
      ...state,
      avatar
    })

    const user = new User()
    user.id = prevState.id
    user.name = name
    user.email = email
    user.avatar = values.avatar
    user.role = values.role
    user.status = values.status
    if (password) await user.setPassword(password)

    const repository = new UsersRepository()
    await repository.update(user)
    revalidateTag('users')

    return {
      ...state,
      success: true,
      message: 'User changed successfully!'
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        ...state,
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as EditUserFieldErrors
      }
    }

    return {
      ...state,
      success: false,
      message: 'Failed to update user information.',
      errors: {
        database: [
          error instanceof Error ? error.message : 'Unknown error occurred'
        ]
      }
    }
  }
}

export default editUserAction
