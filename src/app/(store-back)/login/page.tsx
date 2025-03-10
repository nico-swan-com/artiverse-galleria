'use client'

import { signIn, useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const [email, setEmail] = useState('nicoswan@gmail.com')
  const [password, setPassword] = useState('12345')
  const { status } = useSession() // Destructure status
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter() // Initialize useRouter

  const handleSignIn = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false // Important: Prevent default redirect
    })

    setIsLoading(false)

    if (result?.error) {
      // Handle sign-in error (e.g., show an error message)
      console.error('Sign-in error:', result.error)
    } else {
      router.push('/dashboard')
      return null
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  return (
    <div className='flex min-h-screen items-center justify-center bg-secondary/50 p-4'>
      <div className='w-full max-w-md animate-slide-up'>
        <Card className='border-gray-100 shadow-elevated'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='text-2xl font-semibold'>Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
