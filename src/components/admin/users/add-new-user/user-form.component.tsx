'use client'

import React, { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { toast } from 'sonner'
import { UserRoles, UserStatus } from '@/lib/users'
import { formInitialState } from '@/types/form-state.type'
import createUserAction from './add-user.action'
import { Plus } from 'lucide-react'

interface UserAddFormProps {
  onClose: () => void
}

const UserAddForm = ({ onClose }: UserAddFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    formInitialState
  )

  if (state.success) {
    toast.success(state.message)
    onClose()
  }

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' placeholder='John Doe' required />
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
          required
        />
        {state?.errors?.email && (
          <p className='text-red-500'>{state.errors.email.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Password</Label>
        <Input id='password' name='password' type='password' required />
        <span>Suggestion: {generatePassword()}</span>
        {state?.errors?.password && (
          <p className='text-red-500'>{state.errors.password.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Role</Label>
        <Select name='role'>
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
        <Select name='status'>
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

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? (
            'Adding user...'
          ) : (
            <>
              <Plus className='mr-2 size-4' />
              Add user
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

const generatePassword = (): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?'

  let allChars = ''
  allChars += uppercaseChars
  allChars += lowercaseChars
  allChars += numberChars
  allChars += symbolChars

  let generatedPassword = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length)
    generatedPassword += allChars[randomIndex]
  }
  return generatedPassword
}

export default UserAddForm
