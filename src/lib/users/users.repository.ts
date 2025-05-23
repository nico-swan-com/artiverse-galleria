import { PaginationParams } from './../../types/common/pagination-params.type'
import {
  DeleteResult,
  FindOptionsOrderValue,
  Repository,
  UpdateResult
} from 'typeorm'
import { DatabaseRepository } from '../data-access'
import { Users, User, UsersSortBy } from './model'

@DatabaseRepository(User, 'userRepository')
class UsersRepository {
  /**
   * Injected by `@DatabaseRepository`.
   * The decorator returns a Promise that resolves to the actual repository.
   */
  userRepository!: Promise<Repository<User>>

  async getUsers(
    pagination: PaginationParams,
    sortBy: UsersSortBy,
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

  async getUserById(id: string): Promise<User | null> {
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

  async delete(id: string): Promise<DeleteResult> {
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
