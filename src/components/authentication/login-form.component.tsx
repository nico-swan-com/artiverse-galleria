'use client'

import { useActionState } from 'react'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card'
import { Input } from '../ui/input'
import submitLogin from './submit-login.action'
import { Label } from '../ui/label'
import { formInitialState } from '@/types'
import { redirect } from 'next/navigation'

interface LoginFormProps {
  callbackUrl?: string
}

const LoginForm = ({ callbackUrl }: LoginFormProps) => {
  const [state, formAction, isPending] = useActionState(
    submitLogin,
    formInitialState
  )

  if (state.success) {
    redirect(callbackUrl || '/')
  }

  return (
    <Card className='border-gray-100 shadow-elevated'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl font-semibold'>Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='username'>Email</Label>
            <Input
              id='username'
              name='username'
              type='email'
              placeholder='m@example.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
            </div>
            <Input id='password' name='password' type='password' required />
          </div>
        </CardContent>
        <CardFooter>
          <p aria-live='polite'>{state?.message}</p>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginForm
