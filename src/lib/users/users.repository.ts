import { FindOptionsOrderValue, Repository } from 'typeorm'
import { User } from './user.entity'
import { DatabaseRepository } from '../data-access'
import { PaginationParams } from '@/types'
import { Users } from './users.type'

@DatabaseRepository(User, 'userRepository')
class UsersRepository {
  userRepository!: Repository<User>

  async getUsers(
    pagination: PaginationParams,
    sortBy: keyof User = 'createdAt',
    order: FindOptionsOrderValue = 'DESC'
  ): Promise<Users> {
    const { page, limit } = pagination
    const skip = (page - 1) * limit
    try {
      const [users, total] = await (
        await this.userRepository
      ).findAndCount({
        skip,
        take: limit,
        order: { [sortBy]: order }
      })
      return { users, total }
    } catch (error) {
      console.error('Error getting users:', error)
      return { users: [], total: 0 }
    }
  }

  async getUserById(id: number) {
    try {
      return (await this.userRepository).findOne({ where: { id } })
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }
  async getUserByEmail(email: string) {
    try {
      return (await this.userRepository).findOne({
        where: { email }
      })
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async create(user: User) {
    try {
      const repository = await this.userRepository
      const created = await repository.save(user)
      return created
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async update(user: User) {
    try {
      return (await this.userRepository).update(user.id, user)
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  async delete(id: number) {
    try {
      return (await this.userRepository).delete(id)
    } catch (error) {
      console.error('Error deleting user:', error)
      return null
    }
  }
}

const usersRepository = new UsersRepository()

export { UsersRepository, usersRepository }
