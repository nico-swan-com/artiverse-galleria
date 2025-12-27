'use client'

import PageTransition from '@/components/common/utility/PageTransition'
import UsersList from './UsersList'
import { User } from '@/types/users/user.schema'
import { UsersSortBy } from '@/types/users/users-sort-by.type'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { UserRoles } from '@/types/users/user-roles.enum'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

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
          <Button asChild>
            <Link href='/admin/users/new'>
              <UserPlus className='mr-2 size-4' />
              Add user
            </Link>
          </Button>
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
