import {
  ErrorHandlerService,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
} from './error-handler.service'
import { logger } from './logger'

// Mock logger
jest.mock('./logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn()
  }
}))

describe('ErrorHandlerService', () => {
  let errorHandler: ErrorHandlerService

  beforeEach(() => {
    jest.clearAllMocks()
    errorHandler = new ErrorHandlerService()
  })

  describe('handleError', () => {
    it('should handle AppError with status code and code', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR')
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('Test error')
      expect(result.statusCode).toBe(400)
      expect(result.code).toBe('TEST_ERROR')
      expect(logger.error).toHaveBeenCalled()
    })

    it('should handle ValidationError', () => {
      const error = new ValidationError('Invalid input', 'email')
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('Invalid input')
      expect(result.statusCode).toBe(400)
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should handle NotFoundError', () => {
      const error = new NotFoundError('User', '123')
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('User with identifier 123 not found')
      expect(result.statusCode).toBe(404)
      expect(result.code).toBe('NOT_FOUND')
    })

    it('should handle NotFoundError without identifier', () => {
      const error = new NotFoundError('User')
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('User not found')
      expect(result.statusCode).toBe(404)
    })

    it('should handle UnauthorizedError', () => {
      const error = new UnauthorizedError()
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('Unauthorized')
      expect(result.statusCode).toBe(401)
      expect(result.code).toBe('UNAUTHORIZED')
    })

    it('should handle ForbiddenError', () => {
      const error = new ForbiddenError()
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('Forbidden')
      expect(result.statusCode).toBe(403)
      expect(result.code).toBe('FORBIDDEN')
    })

    it('should handle generic Error', () => {
      const error = new Error('Generic error')
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('An unexpected error occurred')
      expect(result.statusCode).toBe(500)
      expect(result.code).toBe('INTERNAL_ERROR')
      expect(logger.error).toHaveBeenCalled()
    })

    it('should handle unknown error types', () => {
      const error = 'String error'
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('An unexpected error occurred')
      expect(result.statusCode).toBe(500)
    })

    it('should include context in logging', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR')
      const context = { userId: '123', action: 'test' }

      errorHandler.handleError(error, context)

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Test error'),
        error,
        expect.objectContaining(context)
      )
    })

    it('should handle unknown error types with code', () => {
      const error = 'String error'
      const result = errorHandler.handleError(error)

      expect(result.message).toBe('An unexpected error occurred')
      expect(result.statusCode).toBe(500)
      expect(result.code).toBe('UNKNOWN_ERROR')
    })
  })

  describe('wrapAsync', () => {
    it('should return result from async function', async () => {
      const fn = async () => 'success'
      const result = await errorHandler.wrapAsync(fn)

      expect(result).toBe('success')
    })

    it('should handle and rethrow error', async () => {
      const error = new Error('Test error')
      const fn = async () => {
        throw error
      }

      await expect(errorHandler.wrapAsync(fn)).rejects.toThrow('Test error')
      expect(logger.error).toHaveBeenCalled()
    })

    it('should include context when handling error', async () => {
      const error = new Error('Test error')
      const fn = async () => {
        throw error
      }
      const context = { userId: '123' }

      await expect(errorHandler.wrapAsync(fn, context)).rejects.toThrow(
        'Test error'
      )
      expect(logger.error).toHaveBeenCalledWith(
        expect.any(String),
        error,
        context
      )
    })
  })

  describe('Error Classes', () => {
    it('should create AppError with default values', () => {
      const error = new AppError('Test')
      expect(error.message).toBe('Test')
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
    })

    it('should create ValidationError with field', () => {
      const error = new ValidationError('Invalid', 'email')
      expect(error.message).toBe('Invalid')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.field).toBe('email')
    })
  })
})
