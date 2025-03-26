'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React, { useState } from 'react'
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
const LoginPage = () => {
  const [email, setEmail] = useState('nicoswan@gmail.com')
  const [password, setPassword] = useState('12345')
  const { data } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const handleSignIn = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    await signIn('credentials', { email, password, redirect: false })
    setIsLoading(false)
  }
  if (data) {
    return (
      <div>
        <p>Signed in as {data?.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
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
              {/* <div className="text-xs text-muted-foreground">
          <p>Demo credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: password</p>
        </div> */}
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
