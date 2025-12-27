'use client'

import React, { useActionState, useEffect, useState, useMemo } from 'react'
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

// Simple email validation regex
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const CreateUserForm = ({ onClose }: CreateUserFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialFormState
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  // Compute form validity
  const isFormValid = useMemo(() => {
    const isNameValid = name.trim().length >= 2
    const isEmailValid = isValidEmail(email)
    return isNameValid && isEmailValid && isPasswordValid
  }, [name, email, isPasswordValid])

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
        <Label htmlFor='name'>
          Name <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {state?.errors?.name && (
          <p className='text-sm font-medium text-destructive'>
            {state?.errors.name.join(', ')}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>
          Email <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {email && !isValidEmail(email) && (
          <p className='text-sm font-medium text-destructive'>
            Please enter a valid email address
          </p>
        )}
        {state.errors?.email && (
          <p className='text-sm font-medium text-destructive'>
            {state?.errors?.email.join(', ')}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>
          Password <span className='text-destructive'>*</span>
        </Label>
        <PasswordInput
          id='password'
          name='password'
          required
          onValidChange={setIsPasswordValid}
        />
      </div>

      <div className='flex w-full justify-end pt-4'>
        {state?.success === false && state.message && (
          <p className='text-sm font-medium text-destructive'>
            {state.message}
          </p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button
          type='submit'
          disabled={isPending || !isFormValid}
          className='w-full'
        >
          {isPending ? 'Adding user...' : 'Add user'}
        </Button>
      </div>
    </form>
  )
}

export default CreateUserForm
