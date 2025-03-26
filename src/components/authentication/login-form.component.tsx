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
import { useRouter } from 'next/navigation'
import { formInitialState } from '@/types/form-state.type'

const LoginForm = () => {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    submitLogin,
    formInitialState
  )

  if (!isPending && state?.success) {
    router.push('/dashboard')
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
