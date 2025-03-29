'use client'

import React, { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types/form-state.type'
import { User } from '@/types/user'
import deleteUserAction from './delete-user.action'
import { UserRoles, UserStatus } from '@/lib/users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface DeleteUserFormProps {
  user: User
  onClose: () => void
}

const DeleteUserForm = ({ user, onClose }: DeleteUserFormProps) => {
  const [state, formAction, isPending] = useActionState(
    deleteUserAction,
    formInitialState
  )

  if (state.success) {
    toast.success(state.message)
    onClose()
  }

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <Input id='userId' name='userId' type='hidden' defaultValue={user.id} />
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          disabled
          defaultValue={user.name}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          defaultValue={user.email}
          disabled
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Role</Label>
        <Select name='role' defaultValue={user.role} disabled>
          <SelectTrigger>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(UserRoles).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='status'>Status</Label>
        <Select name='status' defaultValue={user.status} disabled>
          <SelectTrigger>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(UserStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Removing user...' : 'Remove user'}
        </Button>
      </div>
    </form>
  )
}

export default DeleteUserForm
