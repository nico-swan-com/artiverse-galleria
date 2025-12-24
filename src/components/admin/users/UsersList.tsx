'use client'

import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import EditUserDialog from './edit-user/EditUserDialog'
import DeleteUserDialog from './delete-user/DeleteUserDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowDown, ArrowUp } from 'lucide-react'
import TablePagination from '@/components/common/ui/TablePagination'
import { User } from '@/types/users/user.schema'
import { UsersSortBy } from '@/types/users/users-sort-by.type'
import { getAvatarUrl } from '@/lib/utilities/get-avatar-url'

interface UsersListProps {
  users: User[]
  total: number
  page: number
  limit: number
  sortBy: UsersSortBy
  order: FindOptionsOrderValue
}

const UsersList = ({
  users,
  total,
  page,
  limit,
  sortBy,
  order
}: UsersListProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramsURL = new URLSearchParams(Array.from(searchParams.entries()))

  const pages = Math.ceil(total / limit)

  const createSortURL = (newSortBy: keyof User) => {
    const current = new URLSearchParams(paramsURL)

    current.set('page', '1')
    current.set('sortBy', newSortBy)
    current.set(
      'order',
      sortBy === newSortBy && order === 'ASC' ? 'DESC' : 'ASC'
    )

    return `?${current.toString()}`
  }

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
          <Table>
            {/* <TableCaption></TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => router.push(createSortURL('name'))}
                  className='cursor-pointer'
                >
                  User
                  {sortBy === 'name' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => router.push(createSortURL('role'))}
                  className='cursor-pointer'
                >
                  Role
                  {sortBy === 'role' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => router.push(createSortURL('status'))}
                  className='cursor-pointer'
                >
                  Status
                  {sortBy === 'status' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => router.push(createSortURL('createdAt'))}
                  className='cursor-pointer'
                >
                  Created
                  {sortBy === 'createdAt' &&
                    (order === 'ASC' ? (
                      <ArrowUp className='ml-2 inline-block size-4' />
                    ) : (
                      <ArrowDown className='ml-2 inline-block size-4' />
                    ))}
                </TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage
                          src={
                            user.avatar || getAvatarUrl(user.email, user.name)
                          }
                          alt={user.name}
                        />
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
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'Active' ? 'default' : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-muted-foreground'>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className='text-end'>
                    <EditUserDialog user={user} />
                    <DeleteUserDialog user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination
        page={page}
        pages={pages}
        limitPages={2}
        searchParamsUrl={paramsURL}
      />
    </>
  )
}

export default UsersList
