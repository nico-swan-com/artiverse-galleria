'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import editUserAction, { EditUserState } from './edit-user.action'
import { User, UserRoles, UserStatus } from '@/lib/users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { PasswordInput } from '../create-user/PasswordInput'

interface EditUserFormProps {
  user: User
  onClose: () => void
}

const initialFormState: EditUserState = {
  id: '',
  success: false,
  message: '',
  name: '',
  email: '',
  password: '',
  newPassword: '',
  role: '',
  status: '',
  errors: {}
}

const EditUserForm = ({ user, onClose }: EditUserFormProps) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [state, formAction, isPending] = useActionState<
    EditUserState,
    FormData
  >(editUserAction, {
    ...initialFormState,
    id: user.id!,
    name: user.name,
    email: user.email,
    password: user.password!,
    role: user.role,
    status: user.status
  })

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      state.message = ''
      onClose()
    }
  }, [state, isPending, onClose])

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
        {!state.success && state.errors?.name && (
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
        {!state.success && state.errors?.email && (
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
        {!state.success && state.errors?.role && (
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
        {!state.success && state.errors?.status && (
          <p className='text-red-500'>{state.errors.status.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='avatar'>Avatar</Label>
        <Input id='avatar' name='avatar' type='file' accept='image/*' />
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
            <Label htmlFor='newPassword'>Password</Label>
            <PasswordInput id='newPassword' name='newPassword' required />
            {!state.success && state.errors?.password && (
              <p className='text-red-500'>
                Password must be between 8 and 20 characters long and include
                uppercase letters, lowercase letters, numbers, and at least one
                special character.
              </p>
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
