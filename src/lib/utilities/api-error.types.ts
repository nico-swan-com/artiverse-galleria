/**
 * Legacy API error type for backward compatibility
 * @deprecated Use AppError from error-handler.service instead
 */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}
