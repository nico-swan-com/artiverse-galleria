import { UserRoles } from '../../../types/users/user-roles.enum'
import { UserStatus } from '../../../types/users/user-status.enum'
import { NewUser } from '../schema'
import * as bcrypt from 'bcryptjs'

export const getUsers = async (): Promise<NewUser[]> => {
  const hashedPassword = await bcrypt.hash('12345', 10)

  return [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
      name: 'Nico Swan',
      email: 'nicoswan@gmail.com',
      password: hashedPassword,
      role: UserRoles.Admin,
      status: UserStatus.Active,
      avatar: 'https://github.com/shadcn.png',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    },
    {
      id: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: hashedPassword,
      role: UserRoles.Client,
      status: UserStatus.Active,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }
  ]
}
