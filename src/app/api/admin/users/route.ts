import { UsersController } from '@/lib/users'

const usersController = new UsersController()

export const GET = usersController.getUsers
