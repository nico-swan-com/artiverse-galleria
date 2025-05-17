'use server'

import { z } from 'zod'
import { PasswordSchema, User, UserSchema, UsersRepository } from '@/lib/users'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function editUserAction(prevState: any, formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString() || ''
    const name = formData.get('name')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const newPassword = formData.get('newPassword')?.toString() || ''
    const password = !!newPassword
      ? PasswordSchema.parse(newPassword)
      : undefined

    const values = UserSchema.parse({
      name,
      email,
      avatar: getAvatarUrl(email, name),
      role: formData.get('role'),
      status: formData.get('status')
    })

    const user = new User()
    user.id = userId
    user.name = name
    user.email = email
    user.avatar = values.avatar
    user.role = values.role
    user.status = values.status
    if (password) await user.setPassword(password)

    const repository = new UsersRepository()
    await repository.update(user)
    revalidateTag('users')

    return { success: true, message: 'User changed successfully!' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error(error)
      return {
        success: false,
        message: 'Failed to update user.',
        errors: {
          database: [error.message]
        } as { [x: string]: string[] | undefined }
      }
    }
  }
}

export default editUserAction
