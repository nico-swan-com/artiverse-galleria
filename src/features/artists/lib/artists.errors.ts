/**
 * Artist Domain Errors
 *
 * Custom error classes for the artists domain.
 * These errors provide more specific error handling and messaging
 * for artist-related operations.
 */

/**
 * Base class for all artist-related errors
 */
export class ArtistError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'ArtistError'
  }
}

/**
 * Error thrown when an artist is not found
 */
export class ArtistNotFoundError extends ArtistError {
  constructor(identifier: string) {
    super(`Artist not found: ${identifier}`, 'ARTIST_NOT_FOUND')
    this.name = 'ArtistNotFoundError'
  }
}

/**
 * Error thrown when an artist already exists (e.g., duplicate email)
 */
export class ArtistAlreadyExistsError extends ArtistError {
  constructor(email: string) {
    super(
      `Artist with email "${email}" already exists`,
      'ARTIST_ALREADY_EXISTS'
    )
    this.name = 'ArtistAlreadyExistsError'
  }
}

/**
 * Error thrown when artist validation fails
 */
export class ArtistValidationError extends ArtistError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'ARTIST_VALIDATION_ERROR')
    this.name = 'ArtistValidationError'
  }
}

/**
 * Error thrown when artist portfolio operations fail
 */
export class ArtistPortfolioError extends ArtistError {
  constructor(message: string) {
    super(message, 'ARTIST_PORTFOLIO_ERROR')
    this.name = 'ArtistPortfolioError'
  }
}
