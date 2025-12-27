'use server'

import { z } from 'zod'
import { LoginSchema } from '../components/login.schema'
import { signIn } from '@/features/authentication/lib'
import { CredentialsSignin } from 'next-auth'

export type LoginFieldErrors = {
  email?: string[]
  password?: string[]
  credentials?: string[]
}

export type LoginState = {
  success: boolean
  message: string
  email: string
  password: string
  errors: LoginFieldErrors
}

async function submitLogin(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('username')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  const state: LoginState = {
    success: false,
    message: '',
    email,
    password,
    errors: {}
  }

  try {
    const credentials = LoginSchema.parse({
      email: formData.get('username'),
      password: formData.get('password')
    })

    await signIn('credentials', {
      ...credentials,
      redirect: false
    })

    return {
      ...state,
      success: true,
      message: 'Login successful',
      password: ''
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        ...state,
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
        password: ''
      }
    }

    if (error instanceof CredentialsSignin) {
      return {
        ...state,
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: ['Invalid email or password']
        },
        password: ''
      }
    }

    console.error('Authentication error:', error)
    return {
      ...state,
      success: false,
      message: 'An unexpected error occurred',
      errors: {
        credentials: ['An unexpected error occurred']
      },
      password: ''
    }
  }
}

export default submitLogin
