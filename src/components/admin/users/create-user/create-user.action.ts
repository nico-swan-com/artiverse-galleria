'use server'

import { z } from 'zod'
// import { UsersEntity } from '@/lib/users/model' // Remove entity import
import { UserRoles } from '@/types/users/user-roles.enum'
import { UserStatus } from '@/types/users/user-status.enum'
import { PasswordSchema, UserSchema } from '@/types/users/user.schema'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import Users from '@/lib/users/users.service'
import bcrypt from 'bcryptjs'
import { NewUser } from '@/lib/database/schema'

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

    const newPassword = PasswordSchema.parse(password)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

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
