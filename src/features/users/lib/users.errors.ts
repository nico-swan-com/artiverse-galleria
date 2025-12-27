/**
 * User Domain Errors
 *
 * Custom error classes for the users domain.
 * These errors provide more specific error handling and messaging
 * for user-related operations.
 */

/**
 * Base class for all user-related errors
 */
export class UserError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'UserError'
  }
}

/**
 * Error thrown when a user is not found
 */
export class UserNotFoundError extends UserError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND')
    this.name = 'UserNotFoundError'
  }
}

/**
 * Error thrown when a user already exists (e.g., duplicate email)
 */
export class UserAlreadyExistsError extends UserError {
  constructor(email: string) {
    super(`User with email "${email}" already exists`, 'USER_ALREADY_EXISTS')
    this.name = 'UserAlreadyExistsError'
  }
}

/**
 * Error thrown when user validation fails
 */
export class UserValidationError extends UserError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'USER_VALIDATION_ERROR')
    this.name = 'UserValidationError'
  }
}

/**
 * Error thrown when user credentials are invalid
 */
export class InvalidCredentialsError extends UserError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS')
    this.name = 'InvalidCredentialsError'
  }
}

/**
 * Error thrown when a user doesn't have permission for an action
 */
export class UserPermissionError extends UserError {
  constructor(action: string) {
    super(
      `User does not have permission to ${action}`,
      'USER_PERMISSION_DENIED'
    )
    this.name = 'UserPermissionError'
  }
}

/**
 * Error thrown when user account is in an invalid state
 */
export class UserAccountError extends UserError {
  constructor(message: string) {
    super(message, 'USER_ACCOUNT_ERROR')
    this.name = 'UserAccountError'
  }
}
