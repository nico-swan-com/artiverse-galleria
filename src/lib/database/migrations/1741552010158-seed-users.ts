import { MigrationInterface, QueryRunner } from 'typeorm'
import { User, UserRoles, UserStatus } from '../../users/model' // Import enums
import { faker } from '@faker-js/faker' // Import Faker
import { getAvatarUrl } from '../../utilities'

export const users: User[] = [
  {
    id: 0,
    email: 'nicoswan@gmail.com',
    name: 'Nico Swan',
    avatar:
      'https://www.gravatar.com/avatar/0524df0fd1ea610c64dd2fb1d5e7dea130afa2948f3fce50c9998aa944269a37?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/Nico%20Swan/128',
    password: '$2b$10$6MtYzTCwOIC1q4XtoiN3NevsXBXrv0aqsVC2yKxf1YUcAmtY4IxEK', // password is 12345
    role: UserRoles.Admin,
    status: UserStatus.Active
  }
] as User[]

export class SeedUsers1741552010158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User)
    const templateUser = users[0]

    const newUsers = Array.from({ length: 10 }, () => {
      const email = faker.internet.email()
      const name = faker.person.fullName()
      const roles = Object.values(UserRoles)
      const statuses = Object.values(UserStatus)
      const randomRole = roles[Math.floor(Math.random() * roles.length)]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        email,
        name,
        avatar: getAvatarUrl(email, name),
        password: templateUser.password,
        role: randomRole,
        status: randomStatus
      }
    })

    try {
      await userRepository.insert([...users, ...newUsers])
      console.log('Users seeded successfully!')
    } catch (error) {
      console.error('Error seeding users:', error)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User)

    try {
      const usersToRemove = await userRepository.find()
      await userRepository.remove(usersToRemove)
      console.log('Seeded users removed successfully!')
    } catch (error) {
      console.error('Error removing seeded users:', error)
    }
  }
}
