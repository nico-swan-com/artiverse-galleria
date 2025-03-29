'use client'

import React, { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types/form-state.type'
import { User } from '@/types/user'
import editUserAction from './edit-user.action'
import { UserRoles, UserStatus } from '@/lib/users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface EditUserFormProps {
  user: User
  onClose: () => void
}

const EditUserForm = ({ user, onClose }: EditUserFormProps) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  const [state, formAction, isPending] = useActionState(
    editUserAction,
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
          required
          defaultValue={user.name}
        />
        {state?.errors?.name && (
          <p className='text-red-500'>{state.errors.name.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          defaultValue={user.email}
          required
        />
        {state?.errors?.email && (
          <p className='text-red-500'>{state.errors.email.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Role</Label>
        <Select name='role' defaultValue={user.role}>
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
        {state?.errors?.role && (
          <p className='text-red-500'>{state.errors.role.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='status'>Status</Label>
        <Select name='status' defaultValue={user.status}>
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
        {state?.errors?.status && (
          <p className='text-red-500'>{state.errors.status.join(', ')}</p>
        )}
      </div>

      {!showPasswordFields && (
        <Button
          className='w-full'
          variant='secondary'
          onClick={() => setShowPasswordFields(true)}
        >
          Change Password
        </Button>
      )}

      <Input
        id='password'
        name='password'
        type='hidden'
        defaultValue={user.password}
      />

      {showPasswordFields && (
        <>
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New password</Label>
            <Input id='newPassword' name='newPassword' type='password' />
            {state?.errors?.password && (
              <p className='text-red-500'>{state.errors.password.join(', ')}</p>
            )}
          </div>
        </>
      )}

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Updating user...' : 'Update user'}
        </Button>
      </div>
    </form>
  )
}

export default EditUserForm
