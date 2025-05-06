'use server'

import { LoginSchema } from './login.schema'
import { z } from 'zod'
import { signIn } from '@/lib/authentication'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function submitLogin(prevState: any, formData: FormData) {
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
        success: false,
        message: 'Sign-in error.',
        errors: result.error
      }
    } else {
      return { success: true }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Return the errors to the form
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error(error)
      return {
        success: false,
        message: 'Invalid form submission.',
        errors: error.errors
      }
    }
  }
}

export default submitLogin
