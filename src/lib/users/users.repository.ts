import {
  DeleteResult,
  FindOptionsOrderValue,
  Repository,
  UpdateResult
} from 'typeorm'
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
      const repository = await this.userRepository
      const [users, total] = await repository.findAndCount({
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

  async getUserById(id: number): Promise<User | null> {
    try {
      const repository = await this.userRepository
      const found = await repository.findOne({ where: { id } })
      return found
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const repository = await this.userRepository
      const found = await repository.findOne({
        where: { email }
      })
      return found
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async create(user: User): Promise<User> {
    try {
      const repository = await this.userRepository
      const created = await repository.save(user)
      return created
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async update(user: User): Promise<UpdateResult> {
    try {
      const repository = await this.userRepository
      const updated = await repository.update(user.id, user)
      return updated
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      const repository = await this.userRepository
      const deleted = await repository.delete(id)
      return deleted
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}

const usersRepository = new UsersRepository()

export { UsersRepository, usersRepository }
