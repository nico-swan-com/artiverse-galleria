'use server'

import { z } from 'zod'
import { UsersRepository } from '@/lib/users'
import { revalidateTag } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteUserAction(prevState: any, formData: FormData) {
  try {
    const UserIdSchema = z.string().nonempty({ message: 'Invalid user ID.' })

    const userId = UserIdSchema.parse(formData.get('userId')?.toString())

    const repository = new UsersRepository()

    await repository.delete(userId)
    revalidateTag('users')

    return { success: true, message: 'User removed successfully!' }
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
        message: 'Failed to remove user.',
        errors: {
          database: [error.message]
        }
      }
    }
  }
}

export default deleteUserAction
