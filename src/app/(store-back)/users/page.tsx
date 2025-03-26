'use client'

import PageTransition from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { UserPlus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import UserForm from '@/components/users/UserForm'
import UsersList from '@/components/users/UsersList'
import { User } from '@/types/user'
import { Suspense } from 'react'

const Users = () => {
  // Initialize state variables regardless of status
  let users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      avatar: '/placeholder.svg',
      password: 'password',
      createdAt: new Date('2023-01-15').toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      status: 'Active',
      password: 'password',
      avatar: '/placeholder.svg',
      createdAt: new Date('2023-02-20').toISOString()
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      role: 'Viewer',
      status: 'Inactive',
      password: 'password',
      avatar: '/placeholder.svg',
      createdAt: new Date('2023-03-10').toISOString()
    }
  ]

  let searchQuery = ''

  // if (status !== 'authenticated') {
  //   // Render a loading state or an unauthorized message
  //   return <div>Unauthorized or Loading...</div>
  // }

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: (users.length + 1).toString(),
      createdAt: new Date().toISOString()
    }
    users = [...users, newUser]
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className='mr-2 size-4' />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <Suspense>
                <UserForm onSubmit={addUser} />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>

        <div className='relative'>
          <Search className='absolute left-3 top-3 size-4 text-muted-foreground' />
          <Input
            placeholder='Search users...'
            className='pl-9'
            value={searchQuery}
            onChange={(e) => (searchQuery = e.target.value)}
          />
        </div>

        <UsersList users={filteredUsers} />
      </div>
    </PageTransition>
  )
}

export default Users
