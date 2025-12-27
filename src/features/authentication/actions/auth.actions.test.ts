import submitLogin, { LoginState } from './auth.actions'
import { signIn } from '@/features/authentication/lib'
import { CredentialsSignin } from 'next-auth'
import { checkRateLimit, RATE_LIMIT_CONFIG } from '@/lib/security'
import { z } from 'zod'

// Mock dependencies
jest.mock('@/features/authentication/lib', () => ({
  signIn: jest.fn()
}))

jest.mock('@/lib/security', () => ({
  checkRateLimit: jest.fn(),
  RATE_LIMIT_CONFIG: {
    AUTH: {
      limit: 5,
      window: 15 * 60 * 1000,
      message: 'Too many authentication attempts. Please try again later.'
    }
  }
}))

describe('Authentication Actions', () => {
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
  const mockCheckRateLimit = checkRateLimit as jest.MockedFunction<
    typeof checkRateLimit
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('submitLogin', () => {
    const initialState: LoginState = {
      success: false,
      message: '',
      email: '',
      password: '',
      errors: {}
    }

    it('should successfully log in with valid credentials', async () => {
      const formData = new FormData()
      formData.append('username', 'test@example.com')
      formData.append('password', 'password123')

      mockCheckRateLimit.mockResolvedValue(undefined)
      mockSignIn.mockResolvedValue(undefined)

      const result = await submitLogin(initialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Login successful')
      expect(result.email).toBe('test@example.com')
      expect(result.password).toBe('')
      expect(mockCheckRateLimit).toHaveBeenCalledWith(RATE_LIMIT_CONFIG.AUTH)
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false
      })
    })

    it('should handle rate limit exceeded', async () => {
      const formData = new FormData()
      formData.append('username', 'test@example.com')
      formData.append('password', 'password123')

      const rateLimitError = new Error(
        'Too many authentication attempts. Please try again later.'
      ) as Error & { code?: string }
      rateLimitError.code = 'RATE_LIMIT_EXCEEDED'
      mockCheckRateLimit.mockRejectedValue(rateLimitError)

      const result = await submitLogin(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.errors.credentials).toContain(rateLimitError.message)
      expect(mockCheckRateLimit).toHaveBeenCalled()
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should handle invalid credentials', async () => {
      const formData = new FormData()
      formData.append('username', 'test@example.com')
      formData.append('password', 'wrongpassword')

      mockCheckRateLimit.mockResolvedValue(undefined)
      mockSignIn.mockRejectedValue(new CredentialsSignin('Invalid credentials'))

      const result = await submitLogin(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
      expect(result.errors.credentials).toContain('Invalid email or password')
      expect(result.password).toBe('')
    })

    it('should handle validation errors', async () => {
      const formData = new FormData()
      formData.append('username', 'invalid-email')
      formData.append('password', '')

      mockCheckRateLimit.mockResolvedValue(undefined)

      const result = await submitLogin(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validation failed')
      expect(result.errors).toBeDefined()
      expect(result.password).toBe('')
      expect(mockSignIn).not.toHaveBeenCalled()
    })

    it('should handle unexpected errors', async () => {
      const formData = new FormData()
      formData.append('username', 'test@example.com')
      formData.append('password', 'password123')

      const unexpectedError = new Error('Unexpected error')
      mockCheckRateLimit.mockResolvedValue(undefined)
      mockSignIn.mockRejectedValue(unexpectedError)

      // Spy on console.error to verify it's called
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = await submitLogin(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('An unexpected error occurred')
      expect(result.errors.credentials).toContain(
        'An unexpected error occurred'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication error:',
        unexpectedError
      )

      consoleSpy.mockRestore()
    })
  })
})
