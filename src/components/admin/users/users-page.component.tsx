'use client'
import PageTransition from '@/components/common/utility/page-transition.component'
import UsersList from './users-list.component'
import { User } from '@/types/user'
import CreateUserDialog from './create-user/create-user-dialog.component'

interface UsersProps {
  users: User[]
}

const UsersPage = ({ users }: UsersProps) => {
  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <CreateUserDialog />
        </div>

        <UsersList users={users} />
      </div>
    </PageTransition>
  )
}

export default UsersPage
