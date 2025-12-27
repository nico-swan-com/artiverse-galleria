import { logger } from './logger'

/**
 * Application-specific error types
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
    public readonly isOperational = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier
        ? `${resource} with identifier ${identifier} not found`
        : `${resource} not found`,
      404,
      'NOT_FOUND'
    )
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

/**
 * Error handler service
 * Centralizes error handling and logging
 */
export class ErrorHandlerService {
  /**
   * Handles errors and returns appropriate response
   * @param error - The error to handle
   * @param context - Additional context about where the error occurred
   * @returns Error information for API responses
   */
  handleError(
    error: unknown,
    context?: Record<string, unknown>
  ): {
    message: string
    statusCode: number
    code?: string
  } {
    // Log the error with context
    if (error instanceof AppError) {
      logger.error(`Application error: ${error.message}`, error, {
        ...context,
        statusCode: error.statusCode,
        code: error.code,
        isOperational: error.isOperational
      })

      return {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code
      }
    }

    // Handle known error types
    if (error instanceof Error) {
      logger.error(`Unexpected error: ${error.message}`, error, context)

      // Don't expose internal error details to clients
      return {
        message: 'An unexpected error occurred',
        statusCode: 500,
        code: 'INTERNAL_ERROR'
      }
    }

    // Handle unknown error types
    logger.error('Unknown error type', error, context)

    return {
      message: 'An unexpected error occurred',
      statusCode: 500,
      code: 'UNKNOWN_ERROR'
    }
  }

  /**
   * Wraps async functions with error handling
   * @param fn - The async function to wrap
   * @param context - Context for error logging
   */
  async wrapAsync<T>(
    fn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      this.handleError(error, context)
      throw error
    }
  }
}

export const errorHandler = new ErrorHandlerService()
