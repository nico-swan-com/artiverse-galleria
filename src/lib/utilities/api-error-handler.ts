import { NextResponse } from 'next/server'
import { errorHandler, AppError } from './error-handler.service'
import { ApiError } from './api-error.types'

/**
 * Legacy ApiError class for backward compatibility
 * @deprecated Use AppError from error-handler.service instead
 */
export { ApiError }

/**
 * Handles API errors and returns appropriate NextResponse
 * @param error - The error to handle
 * @returns NextResponse with error information
 */
export const handleApiError = (error: unknown): NextResponse => {
  // Handle legacy ApiError for backward compatibility
  if (error instanceof ApiError) {
    const errorInfo = errorHandler.handleError(error, {
      source: 'api-error-handler',
      legacyError: true
    })
    return new NextResponse(
      JSON.stringify({
        error: errorInfo.message,
        code: errorInfo.code
      }),
      {
        status: errorInfo.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // Handle AppError
  if (error instanceof AppError) {
    const errorInfo = errorHandler.handleError(error, {
      source: 'api-error-handler'
    })
    return new NextResponse(
      JSON.stringify({
        error: errorInfo.message,
        code: errorInfo.code
      }),
      {
        status: errorInfo.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // Handle unknown errors
  const errorInfo = errorHandler.handleError(error, {
    source: 'api-error-handler'
  })

  return new NextResponse(
    JSON.stringify({
      error: errorInfo.message,
      code: errorInfo.code
    }),
    {
      status: errorInfo.statusCode,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
