import { PaginationParams } from '@/types'
import { instanceToPlain } from 'class-transformer'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from 'typeorm'
import { User } from './user.entity'
import { usersRepository, UsersRepository } from './users.repository'

export default class Users {
  repository: UsersRepository

  constructor() {
    this.repository = usersRepository
  }

  async getUsers(
    pagination: PaginationParams,
    sortBy: keyof User,
    order: FindOptionsOrderValue
  ) {
    const repository = new UsersRepository()
    const result = await repository.getUsers(pagination, sortBy, order)
    return result
  }

  async create(user: User) {
    const repository = new UsersRepository()
    const result = await repository.create(user)
    return result
  }

  async update(user: User) {
    const repository = new UsersRepository()
    const result = await repository.update(user)
    return result
  }

  async delete(user: User) {
    const repository = new UsersRepository()
    const result = await repository.delete(user.id)
    return result
  }
}

export const getUsersUnstableCache = unstable_cache(
  async (
    pagination: PaginationParams,
    sortBy: keyof User,
    order: FindOptionsOrderValue
  ) => {
    const result = new Users().getUsers(pagination, sortBy, order)
    return instanceToPlain(result)
  },
  ['users'],
  {
    tags: ['users'],
    revalidate: 1
  }
)

export const createUserUnstableCache = unstable_cache(
  async (user: User) => {
    const result = new Users().create(user)
    return instanceToPlain(result)
  },
  ['users'],
  {
    tags: ['users']
  }
)
