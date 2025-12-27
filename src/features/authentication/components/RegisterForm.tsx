'use client'

import { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import registerAction, {
  RegisterState
} from '@/features/authentication/lib/register.action'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PasswordInput } from '@/features/users/components/admin/PasswordInput'

const initialFormState: RegisterState = {
  success: false,
  message: ''
}

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialFormState
  )
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      // Redirect to login after short delay or immediately
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 1000)
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <Card className='w-full max-w-md border-gray-100 shadow-elevated'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl font-semibold'>
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' placeholder='John Doe' required />
            {state.errors?.name && (
              <p className='text-xs text-destructive'>
                {state.errors.name.join(', ')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='m@example.com'
              required
            />
            {state.errors?.email && (
              <p className='text-xs text-destructive'>
                {state.errors.email.join(', ')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <PasswordInput id='password' name='password' required />
            {state.errors?.password && (
              <p className='text-xs text-destructive'>
                {state.errors.password.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
          <div className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-primary underline-offset-4 hover:underline'
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegisterForm
