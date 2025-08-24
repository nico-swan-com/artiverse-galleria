import { MigrationInterface, QueryRunner } from 'typeorm'
import { UsersEntity } from '../../users/model' // Import entity
import { UserRoles } from '../../../types/users/user-roles.enum' // Import roles enum
import { UserStatus } from '../../../types/users/user-status.enum' // Import status enum
import { faker } from '@faker-js/faker' // Import Faker

export const users: UsersEntity[] = [
  {
    email: 'nicoswan@gmail.com',
    name: 'Nico Swan',
    password: '$2b$10$6MtYzTCwOIC1q4XtoiN3NevsXBXrv0aqsVC2yKxf1YUcAmtY4IxEK', // password is 12345
    role: UserRoles.Admin,
    status: UserStatus.Active
  }
] as UsersEntity[]

export class SeedUsers1741552010158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(UsersEntity)
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
        avatar: undefined,
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
    const userRepository = queryRunner.manager.getRepository(UsersEntity)

    try {
      const usersToRemove = await userRepository.find()
      await userRepository.remove(usersToRemove)
      console.log('Seeded users removed successfully!')
    } catch (error) {
      console.error('Error removing seeded users:', error)
    }
  }
}
