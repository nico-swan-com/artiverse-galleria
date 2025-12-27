'use server'

import { z } from 'zod'
import { UsersRepository } from '@/features/users/lib/users.repository'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAuth } from '@/features/authentication/lib/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'
import { FormState } from '@/types/common/form-state.type'

async function deleteUserAction(
  _prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  try {
    // Authorization: Only Admin can delete users
    await requireAuth([UserRoles.Admin])

    const UserIdSchema = z.string().nonempty({ message: 'Invalid user ID.' })

    const userId = UserIdSchema.parse(formData.get('userId')?.toString())

    const repository = new UsersRepository()

    await repository.delete(userId)
    revalidateTag('users', 'default')
    revalidatePath('/admin/users')

    return { success: true, message: 'User removed successfully!' }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        message: 'Failed to remove user.',
        errors: {
          database: [errorMessage]
        }
      }
    }
  }
}

export default deleteUserAction
