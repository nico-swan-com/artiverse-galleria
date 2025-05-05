'use server'

import { LoginSchema } from './login.schema'
import { z } from 'zod'
import { signIn } from '@/lib/authentication'

/**
 * Handles user login submission by validating credentials and attempting authentication.
 *
 * Validates the provided email and password using {@link LoginSchema}, then attempts to sign in with the credentials. Returns an object indicating success or failure, including error messages and validation details when applicable.
 *
 * @param prevState - The previous state of the form or authentication process.
 * @param formData - The submitted form data containing user credentials.
 * @returns An object with a `success` boolean and, on failure, error messages and details.
 *
 * @remark If validation fails, returns field-specific errors. If authentication fails, returns a general sign-in error. Other errors result in a generic failure response.
 */
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
