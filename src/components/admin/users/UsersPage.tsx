'use client'

import PageTransition from '@/components/common/utility/PageTransition'
import UsersList from './UsersList'
import CreateUserDialog from './create-user/CreateUserDialog'
import { FindOptionsOrderValue } from 'typeorm'
import { User } from '@/types/users/user.schema'
import { UsersSortBy } from '@/types/users/users-sort-by.type'

interface UsersProps {
  users: User[]
  page: number
  limit: number
  total: number
  sortBy: UsersSortBy
  order: FindOptionsOrderValue
}

const UsersPage = ({
  users,
  page,
  limit,
  total,
  sortBy,
  order
}: UsersProps) => {
  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <CreateUserDialog />
        </div>

        <UsersList
          users={users}
          total={total}
          page={page}
          limit={limit}
          sortBy={sortBy}
          order={order}
        />
      </div>
    </PageTransition>
  )
}

export default UsersPage
