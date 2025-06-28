'use server'

import { z } from 'zod'
import {
  PasswordSchema,
  UsersEntity,
  UserSchema,
  UsersRepository
} from '@/lib/users'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'

export type EditUserFieldErrors = {
  id?: string[]
  name?: string[]
  email?: string[]
  password?: string[]
  newPassword?: string[]
  avatar?: string[]
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
  const status = formData.get('status')?.toString() || ''
  const role = formData.get('role')?.toString() || ''
  const password = !!newPassword
    ? PasswordSchema.parse(newPassword)
    : prevState.password
  const avatarFile = formData.get('avatar') as File | null
  let avatarBuffer: Buffer | null = null
  if (avatarFile && typeof avatarFile !== 'string') {
    if (avatarFile.size > 5 * 1024 * 1024) {
      return {
        ...prevState,
        success: false,
        message: 'Avatar file size exceeds the limit of 5MB.',
        errors: { avatar: ['Avatar file size exceeds the limit of 5MB.'] }
      }
    }
    const arrayBuffer = await avatarFile.arrayBuffer()
    avatarBuffer = Buffer.from(arrayBuffer)
  }

  const state: EditUserState = {
    id: prevState.id,
    success: false,
    message: '',
    name,
    email,
    password,
    newPassword,
    role,
    status,
    errors: {}
  }

  try {
    const values = UserSchema.parse({
      ...state,
      avatar: avatarBuffer ? avatarBuffer : getAvatarUrl(email, name)
    })

    const user = new UsersEntity()
    user.id = prevState.id
    user.name = name
    user.email = email
    user.role = values.role || prevState.role
    user.status = values.status || prevState.status
    user.avatar = avatarBuffer || undefined
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
