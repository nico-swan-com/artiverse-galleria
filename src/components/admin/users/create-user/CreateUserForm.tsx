'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import createUserAction from './create-user.action'
import { PasswordInput } from './PasswordInput'
import { formInitialState } from '@/types'

interface CreateUserFormProps {
  onClose: () => void
}

const initialFormState = {
  ...formInitialState,
  errors: {
    name: [],
    email: [],
    password: [],
    database: []
  } as {
    [x: string]: string[] | undefined
    [x: number]: string[] | undefined
    [x: symbol]: string[] | undefined
  },
  name: '',
  email: ''
}

const CreateUserForm = ({ onClose }: CreateUserFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialFormState
  )

  useEffect(() => {
    if (!!state.message && !isPending) {
      if (state.success) {
        toast.success(state.message)
        state.message = ''
        onClose()
      } else {
        console.error(state?.errors)
      }
    }
  }, [state, isPending, onClose])

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          defaultValue={state.name}
          required
        />
        {state?.errors?.name && (
          <p className='text-red-500'>{state?.errors.name.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          defaultValue={state.email}
          required
        />
        {state.errors?.email && (
          <p className='text-red-500'>{state?.errors?.email.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <PasswordInput id='password' name='password' required />
        {(state?.errors?.password?.length || '') && (
          <p className='text-red-500'>
            Password must be between 8 and 20 characters long and include
            uppercase letters, lowercase letters, numbers, and at least one
            special character.
          </p>
        )}
      </div>

      <div className='flex w-full justify-end pt-4'>
        {state?.success === false && (
          <p className='text-red-500'>{state.message}</p>
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
