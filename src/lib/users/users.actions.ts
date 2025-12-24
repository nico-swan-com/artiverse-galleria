import { PaginationParams } from '@/types'

import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from '../../types/common/db.type'
import { User } from '../database/schema'
import Users from './users.service'
import { UsersSortBy } from '../../types/users/users-sort-by.type'

export const getUsersUnstableCache = unstable_cache(
  async (
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order: FindOptionsOrderValue
  ) => {
    const result = await new Users().getUsers(pagination, sortBy, order)
    return result
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
    return result
  },
  ['users'],
  {
    tags: ['users']
  }
)
