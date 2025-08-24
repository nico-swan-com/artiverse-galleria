import { PaginationParams } from './../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from 'typeorm'
import { UsersRepository } from './users.repository'
import { User } from './model/user.entity'
import { UsersSortBy } from '../../types/users/users-sort-by.type'

export default class Users {
  repository: UsersRepository

  constructor() {
    this.repository = new UsersRepository()
  }

  async getUsers(
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order: FindOptionsOrderValue
  ) {
    const result = await this.repository.getUsers(pagination, sortBy, order)
    return result
  }

  async create(user: User) {
    const result = await this.repository.create(user)
    return result
  }

  async update(user: User) {
    const result = await this.repository.update(user)
    return result
  }

  async delete(user: User) {
    const result = await this.repository.delete(user.id)
    return result
  }
}
