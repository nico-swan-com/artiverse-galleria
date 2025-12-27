'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag, revalidatePath } from 'next/cache'
import {
  UserCreateSchema,
  UserUpdateSchema,
  PasswordSchema
} from '@/types/users/user.schema'
import Users from '@/features/users/lib/users.service'
import { MediaCreate, MediaService } from '@/features/media'
import {
  requireAuth,
  requireAuthOrSelf
} from '@/features/authentication/lib/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import bcrypt from 'bcryptjs'
import { NewUser, User } from '@/lib/database/schema'
import { UsersRepository } from '@/features/users/lib/users.repository'

export type UserFormFieldErrors = {
  id?: string[]
  name?: string[]
  email?: string[]
  password?: string[]
  newPassword?: string[]
  role?: string[]
  status?: string[]
  avatar?: string[]
  avatarFile?: string[]
  database?: string[]
}

export type UserFormState = {
  id?: string
  success: boolean
  message: string
  name?: string
  email?: string
  password?: string
  newPassword?: string
  role?: string
  status?: string
  avatar?: string
  avatarFile?: File
  errors: UserFormFieldErrors
}

export async function userFormAction(
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const isEdit = formData.get('isEdit') === 'true'
  const id = formData.get('id')?.toString() || ''
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''
  const newPassword = formData.get('newPassword')?.toString() || ''
  const avatarFile = formData.get('avatarFile') as File | null
  const role = formData.get('role')?.toString() || UserRoles.Client
  const status = formData.get('status')?.toString() || UserStatus.Pending

  const cleanPrevAvatar = prevState.avatar?.split('?')[0]
  let avatar = isEdit
    ? formData.get('avatarUrl')?.toString() ||
      cleanPrevAvatar ||
      getAvatarUrl(email, name)
    : getAvatarUrl(email, name)

  // Handle avatar file upload if provided
  if (avatarFile instanceof File) {
    try {
      const mediaService = new MediaService()

      // Delete old user avatar if replacing
      if (isEdit && avatar && avatar.startsWith('/api/media/')) {
        const oldMediaId = avatar.replace('/api/media/', '')
        try {
          await mediaService.deleteImage(oldMediaId)
        } catch (deleteError) {
          console.warn('Failed to delete old user avatar:', deleteError)
        }
      }

      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      const newImage: MediaCreate = {
        fileName: name,
        fileSize: avatarFile.size,
        mimeType: avatarFile.type,
        data: buffer,
        altText: `${name} - User Profile Photo`,
        tags: ['user-avatar', 'user', name.toLowerCase().replace(/\s+/g, '-')]
      }
      const newAvatarUrl =
        await mediaService.uploadOrReplaceUserAvatar(newImage)
      avatar = `/api/media/${newAvatarUrl.id}`
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      return {
        ...prevState,
        success: false,
        message: 'Failed to upload avatar image.',
        errors: {
          avatarFile: ['Failed to upload avatar image']
        }
      }
    }
  }

  const state: UserFormState = {
    id: isEdit ? id : undefined,
    success: false,
    message: '',
    name,
    email,
    password: isEdit ? prevState.password : password,
    newPassword,
    role,
    status,
    avatar,
    avatarFile: avatarFile instanceof File ? avatarFile : undefined,
    errors: {}
  }

  try {
    if (isEdit) {
      // Authorization for edit
      await requireAuthOrSelf(id)

      // Validate password if changing it
      let validatedPassword: string | undefined
      if (newPassword) {
        const passwordResult = PasswordSchema.safeParse(newPassword)
        if (!passwordResult.success) {
          return {
            ...state,
            success: false,
            message: '',
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

      let hashedPassword: string | undefined
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
        id,
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
        message: 'User updated successfully!',
        avatar: values.avatar
          ? `${values.avatar}?t=${Date.now()}`
          : values.avatar
      }
    } else {
      // Create new user - admin only
      await requireAuth([UserRoles.Admin, UserRoles.Editor])

      // Validate password
      const passwordResult = PasswordSchema.safeParse(password)
      if (!passwordResult.success) {
        return {
          ...state,
          success: false,
          message: '',
          errors: {
            password: passwordResult.error.errors.map((e) => e.message)
          }
        }
      }

      const values = UserCreateSchema.parse({
        name,
        email,
        avatar,
        role,
        status
      })

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(passwordResult.data, salt)

      const user: NewUser = {
        name,
        email,
        avatar: values.avatar ?? null,
        role: values.role,
        status: values.status,
        password: hashedPassword
      }

      const services = new Users()
      await services.create(user)
      revalidateTag('users', 'default')
      revalidatePath('/admin/users')

      return {
        ...state,
        success: true,
        message: 'User created successfully!'
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ...state,
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as UserFormFieldErrors
      }
    }

    console.error(error)
    return {
      ...state,
      success: false,
      message: isEdit ? 'Failed to update user.' : 'Failed to create user.',
      errors: {
        database: [
          error instanceof Error ? error.message : 'Unknown error occurred'
        ]
      }
    }
  }
}
