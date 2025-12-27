import { PaginationParams } from '@/types/common/pagination-params.type'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { usersRepository, UsersRepository } from './users.repository'
import { User, NewUser } from '@/lib/database/schema'
import { UsersSortBy } from '@/types/users/users-sort-by.type'

export default class Users {
  private repository: UsersRepository

  constructor(repository: UsersRepository = usersRepository) {
    this.repository = repository
  }

  async getUsers(
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order: FindOptionsOrderValue
  ) {
    const result = await this.repository.getUsers(pagination, sortBy, order)
    return result
  }

  async getById(id: string) {
    const result = await this.repository.getUserById(id)
    return result
  }

  async create(user: NewUser) {
    const result = await this.repository.create(user)
    return result
  }

  async update(user: Partial<User> & { id: string }) {
    const result = await this.repository.update(user)
    return result
  }

  async delete(id: string) {
    const result = await this.repository.delete(id)
    return result
  }
}
