import { PaginationParams } from './../../types/common/pagination-params.type'
import { DeleteResult, FindOptionsOrderValue, UpdateResult } from 'typeorm'
import { User } from './model/user.entity'
import { Users } from '../../types/users/users.type'
import { UsersSortBy } from '../../types/users/users-sort-by.type'
import { getRepository } from '../database'

class UsersRepository {
  async getUsers(
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order: FindOptionsOrderValue = 'DESC'
  ): Promise<Users> {
    const { page, limit } = pagination
    const skip = (page - 1) * limit
    try {
      const repository = await getRepository(User)
      const [users, total] = await repository.findAndCount({
        skip,
        take: limit,
        order: { [sortBy]: order }
      })
      return { users, total }
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const repository = await getRepository(User)
      const found = await repository.findOne({ where: { id } })
      return found
    } catch (error) {
      console.error('Error getting user by id:', error)
      throw error
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const repository = await getRepository(User)
      const found = await repository.findOne({
        where: { email }
      })
      return found
    } catch (error) {
      console.error('Error getting user by email:', error)
      throw error
    }
  }

  async create(user: User): Promise<User> {
    try {
      const repository = await getRepository(User)
      const created = await repository.save(user)
      return created
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async update(user: User): Promise<UpdateResult> {
    try {
      const repository = await getRepository(User)
      const updated = await repository.update(user.id, user)
      return updated
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const repository = await getRepository(User)
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
