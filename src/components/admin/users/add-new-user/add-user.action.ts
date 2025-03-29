'use server'

import { z } from 'zod'
import { CreateUserSchema } from './create-user.schema'
import { User, UsersRepository } from '@/lib/users'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createUserAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const avatar = getAvatarUrl(email, name)

    const values = CreateUserSchema.parse({
      name,
      email,
      avatar,
      password: formData.get('password'),
      role: formData.get('role'),
      status: formData.get('status')
    })

    const user = new User()
    user.name = name
    user.email = email
    user.avatar = avatar || ''
    user.setPassword(values.password)
    user.role = values.role
    user.status = values.status

    const repository = new UsersRepository()

    await repository.createUser(user)
    revalidateTag('users')

    return { success: true, message: 'User created successfully!' }
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
      return { success: false, message: 'Failed to create user.' }
    }
  }
}

export default createUserAction
