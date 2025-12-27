import { UsersController } from '@/features/users'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest } from 'next/server'

const usersController = new UsersController()

export async function GET(request: NextRequest) {
  try {
    return await usersController.getUsers(request)
  } catch (error) {
    return handleApiError(error)
  }
}
