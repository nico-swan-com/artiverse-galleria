import { PaginationParams } from '@/types'
import { instanceToPlain } from 'class-transformer'
import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from 'typeorm'
import { User } from './model/user.entity'
import Users from './users.service'
import { UsersSortBy } from './model'

export const getUsersUnstableCache = unstable_cache(
  async (
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order: FindOptionsOrderValue
  ) => {
    const result = await new Users().getUsers(pagination, sortBy, order)
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
    const result = await new Users().create(user)
    return instanceToPlain(result)
  },
  ['users'],
  {
    tags: ['users']
  }
)
