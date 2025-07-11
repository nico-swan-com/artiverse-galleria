import { PaginationParams } from './../../types/common/pagination-params.type'
import { DeleteResult, FindOptionsOrderValue, UpdateResult } from 'typeorm'
import { Users, UsersEntity, UsersSortBy } from './model'
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
      const repository = await getRepository(UsersEntity)
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

  async getUserById(id: string): Promise<UsersEntity | null> {
    try {
      const repository = await getRepository(UsersEntity)
      const found = await repository.findOne({ where: { id } })
      return found
    } catch (error) {
      console.error('Error getting user by id:', error)
      return null
    }
  }
  async getUserByEmail(email: string): Promise<UsersEntity | null> {
    try {
      const repository = await getRepository(UsersEntity)
      const found = await repository.findOne({
        where: { email }
      })
      return found
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async create(user: UsersEntity): Promise<UsersEntity> {
    try {
      const repository = await getRepository(UsersEntity)
      const created = await repository.save(user)
      return created
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async update(user: UsersEntity): Promise<UpdateResult> {
    try {
      const repository = await getRepository(UsersEntity)
      const updated = await repository.update(user.id, user)
      return updated
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const repository = await getRepository(UsersEntity)
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
