'use client'

import { useActionState, useEffect } from 'react'
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
import submitLogin, { LoginState } from './submit-login.action'
import { Label } from '../ui/label'
import Link from 'next/link'

interface LoginFormProps {
  callbackUrl?: string
}

const initialFormState: LoginState = {
  success: false,
  message: '',
  email: '',
  password: '',
  errors: {}
}

const LoginForm = ({ callbackUrl }: LoginFormProps) => {
  const [state, formAction, isPending] = useActionState(
    submitLogin,
    initialFormState
  )

  useEffect(() => {
    if (state.success) {
      window.location.href = callbackUrl || '/'
    }
  }, [state.success, callbackUrl])

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
        <CardFooter className='flex flex-col space-y-4'>
          <p aria-live='polite' className='text-sm text-destructive'>
            {state?.message}
          </p>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='text-primary underline-offset-4 hover:underline'
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginForm
