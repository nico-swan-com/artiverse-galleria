'use client'

import PageTransition from '@/components/common/utility/page-transition.component'
import UsersList from './users-list.component'
import { User } from '@/types'
import CreateUserDialog from './create-user/create-user-dialog.component'
import { FindOptionsOrderValue } from 'typeorm'
import { UsersSortBy } from '@/lib/users'

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
