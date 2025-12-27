import { PaginationParams } from '@/types'

import { unstable_cache } from 'next/cache'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { User } from '@/lib/database/schema'
import Users from '../lib/users.service'
import { UsersSortBy } from '@/types/users/users-sort-by.type'

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

export const getUserByIdUnstableCache = unstable_cache(
  async (id: string) => {
    const result = await new Users().getById(id)
    return result
  },
  ['user-by-id'],
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
