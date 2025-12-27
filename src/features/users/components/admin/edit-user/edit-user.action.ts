'use server'

import { z } from 'zod'
// import { UsersEntity } from '@/features/users/types'
import { UsersRepository } from '@/features/users/lib/users.repository'
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import { PasswordSchema, UserUpdateSchema } from '@/types/users/user.schema'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidatePath, revalidateTag } from 'next/cache'
import { MediaCreate, MediaService } from '@/features/media'
import { requireAuthOrSelf } from '@/features/authentication/lib/require-auth'
import bcrypt from 'bcryptjs'
import { User } from '@/lib/database/schema'

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
  const avatarFile = formData.get('avatarFile') || undefined
  const role = formData.get('role')?.toString() || prevState.role || ''
  const status = formData.get('status')?.toString() || prevState.status || ''

  // Clean previous avatar URL from query params if it's a local media URL
  const cleanPrevAvatar = prevState.avatar?.split('?')[0]

  const avatar =
    formData.get('avatarUrl')?.toString() ||
    cleanPrevAvatar ||
    getAvatarUrl(email, name)

  const state: EditUserState = {
    id: prevState.id,
    success: false,
    message: '',
    name,
    email,
    password: prevState.password,
    newPassword,
    role,
    status,
    avatar,
    avatarFile: avatarFile instanceof File ? avatarFile : undefined,
    errors: {}
  }

  try {
    // Authorization: Admin/Editor can edit any user, others can only edit themselves
    await requireAuthOrSelf(prevState.id)

    // Validate password if provided
    let validatedPassword: string | undefined
    if (newPassword) {
      const passwordResult = PasswordSchema.safeParse(newPassword)
      if (!passwordResult.success) {
        return {
          ...state,
          success: false,
          message: '', // No message needed - UI indicator shows requirements
          errors: {
            newPassword: passwordResult.error.errors.map((e) => e.message)
          }
        }
      }
      validatedPassword = passwordResult.data
    }

    const values = UserUpdateSchema.parse({
      ...state,
      password: validatedPassword || prevState.password
    })

    if (avatarFile instanceof File) {
      const mediaFiles = new MediaService()
      const data = await avatarFile.arrayBuffer()
      const newImage: MediaCreate = {
        fileName: name,
        fileSize: avatarFile.size,
        mimeType: avatarFile.type,
        data: Buffer.from(data),
        altText: name,
        tags: ['user avatar', 'user', 'profile']
      }
      const newAvatarUrl = await mediaFiles.uploadOrReplaceUserAvatar(newImage)
      values.avatar = `/api/media/${newAvatarUrl.id}`
    }

    let hashedPassword = undefined
    if (validatedPassword) {
      const salt = await bcrypt.genSalt(10)
      hashedPassword = await bcrypt.hash(validatedPassword, salt)
    }

    type UserUpdateData = Partial<User> & {
      id: string
      name: string
      email: string
      avatar?: string | null
      role: UserRoles
      status: UserStatus
      password?: string
    }

    const updateData: UserUpdateData = {
      id: prevState.id,
      name,
      email,
      avatar: values.avatar,
      role: values.role || UserRoles.Client,
      status: values.status || UserStatus.Pending
    }

    if (hashedPassword) {
      updateData.password = hashedPassword
    }

    const repository = new UsersRepository()
    await repository.update(updateData)
    revalidateTag('users', 'default')
    revalidatePath('/admin/users')

    return {
      ...state,
      success: true,
      message: 'User changed successfully!',
      avatar: values.avatar ? `${values.avatar}?t=${Date.now()}` : values.avatar
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
