'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types'
import createUserAction from './create-user.action'

interface CreateUserFormProps {
  onClose: () => void
}

const CreateUserForm = ({ onClose }: CreateUserFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    formInitialState
  )
  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      onClose()
    }
  }, [state, onClose])

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
        {state?.errors?.password && (
          <p className='text-red-500'>{state.errors.password.join(', ')}</p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Adding user...' : 'Add user'}
        </Button>
      </div>
    </form>
  )
}

export default CreateUserForm
