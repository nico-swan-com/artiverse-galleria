'use client'

import PageTransition from '@/components/common/utility/page-transition.component'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Suspense, useState } from 'react'
import UsersList from './users-list.component'
import { User } from '@/types/user'
import UserAddForm from './add-new-user/user-form.component'

interface UsersProps {
  users: User[]
}

const UsersPage = ({ users }: UsersProps) => {
  const [open, setOpen] = useState(false)
  //let searchQuery = ''

  //   const filteredUsers = users.filter(
  //     (user) =>
  //       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       user.email.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  const filteredUsers = users

  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className='mr-2 size-4' />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <Suspense>
                <UserAddForm onClose={() => setOpen(false)} />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>

        {/* <div className='relative'>
          <Search className='absolute left-3 top-3 size-4 text-muted-foreground' />
          <Input
            placeholder='Search users...'
            className='pl-9'
            value={searchQuery}
            onChange={(e) => (searchQuery = e.target.value)}
          />
        </div> */}

        <UsersList users={filteredUsers} />
      </div>
    </PageTransition>
  )
}

export default UsersPage
