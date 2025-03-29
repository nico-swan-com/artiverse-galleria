'use client'

import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types/user'
import EditUserDialog from './edit-user/edit-user-dialog.component'
import DeleteUserDialog from './delete-user/delete-user-dialog.component'

interface UsersListProps {
  users: User[]
}

const UsersList = ({ users }: UsersListProps) => {
  if (users.length === 0) {
    return (
      <div className='py-10 text-center'>
        <p className='text-muted-foreground'>No users found</p>
      </div>
    )
  }

  return (
    <>
      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-muted/50 text-muted-foreground'>
                <th className='px-4 py-3 text-left font-medium'>User</th>
                <th className='px-4 py-3 text-left font-medium'>Role</th>
                <th className='px-4 py-3 text-left font-medium'>Status</th>
                <th className='px-4 py-3 text-left font-medium'>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className='transition-colors hover:bg-muted/50'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{user.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>{user.role}</td>
                  <td className='px-4 py-3'>
                    <Badge
                      variant={
                        user.status === 'Active' ? 'default' : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground'>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className='text-end'>
                    <EditUserDialog user={user} />
                    <DeleteUserDialog user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default UsersList
