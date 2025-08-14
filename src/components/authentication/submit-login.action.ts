'use server'

import { LoginSchema } from './login.schema'
import { signIn } from '@/lib/authentication'

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

    const result = await signIn('credentials', {
      ...credentials,
      redirect: false
    })

    if (result?.error) {
      console.error('Sign-in error:', result.error)
      return {
        ...state,
        success: false,
        message: 'Sign-in error.',
        errors: result.error
      }
    } else {
      return { ...state, success: true, message: 'Login successful' }
    }
  } catch (error: unknown) {
    console.error('Validation error:', error)
    return {
      ...state,
      success: false,
      message: 'Authentication failed',
      errors: {
        credentials: ['Invalid email or password']
      }
    }
  }
}

export default submitLogin
