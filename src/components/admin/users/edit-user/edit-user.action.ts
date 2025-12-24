'use server'

import { z } from 'zod'
import { UsersEntity } from '@/lib/users/model'
import { UsersRepository } from '@/lib/users/users.repository'
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import { PasswordSchema, UserUpdateSchema } from '@/types/users/user.schema'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import { MediaCreate, MediaService } from '@/lib/media'
import { requireAuthOrSelf } from '@/lib/authentication/require-auth'

export type EditUserFieldErrors = {
  id?: string[]
  name?: string[]
  email?: string[]
  password?: string[]
  newPassword?: string[]
  role?: string[]
  status?: string[]
  avatarFile?: string[]
  avatar?: string[]
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
  avatar?: string
  avatarFile?: File
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
  const avatarFile = formData.get('avatarFile') || undefined

  const avatar =
    formData.get('avatarUrl')?.toString() || getAvatarUrl(email, name)

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
    avatar,
    avatarFile: avatarFile instanceof File ? avatarFile : undefined,
    errors: {}
  }

  try {
    // Authorization: Admin/Editor can edit any user, others can only edit themselves
    await requireAuthOrSelf(prevState.id)

    const values = UserUpdateSchema.parse({
      ...state
    })

    if (avatarFile instanceof File) {
      const mediaFiles = new MediaService()
      const data = await avatarFile.arrayBuffer()
      const newImage: MediaCreate = {
        fileName: avatarFile.name,
        fileSize: avatarFile.size,
        mimeType: avatarFile.type,
        data: Buffer.from(data),
        altText: name,
        tags: ['avatar', 'user', 'profile']
      }
      const newAvatarUrl = await mediaFiles.uploadImage(newImage)
      values.avatar = `/api/media/${newAvatarUrl.id}`
    }

    const user = new UsersEntity()
    user.id = prevState.id
    user.name = name
    user.email = email
    user.avatar = values.avatar
    user.role = values.role || UserRoles.Client
    user.status = values.status || UserStatus.Pending
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
