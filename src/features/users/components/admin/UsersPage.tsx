'use client'

import PageTransition from '@/components/common/utility/PageTransition'
import UsersList from './UsersList'
import CreateUserSheet from './create-user/CreateUserDialog'
import { User } from '@/types/users/user.schema'
import { UsersSortBy } from '@/types/users/users-sort-by.type'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { UserRoles } from '@/types/users/user-roles.enum'

interface UsersProps {
  users: User[]
  page: number
  limit: number
  total: number
  sortBy: UsersSortBy
  order: FindOptionsOrderValue
  currentUserRole: UserRoles
}

const UsersPage = ({
  users,
  page,
  limit,
  total,
  sortBy,
  order,
  currentUserRole
}: UsersProps) => {
  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <CreateUserSheet />
        </div>

        <UsersList
          users={users}
          total={total}
          page={page}
          limit={limit}
          sortBy={sortBy}
          order={order}
          currentUserRole={currentUserRole}
        />
      </div>
    </PageTransition>
  )
}

export default UsersPage
