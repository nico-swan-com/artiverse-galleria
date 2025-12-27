import { SEARCH_CONFIG } from '../constants/app.constants'
import { ilike, or, type SQL } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'

/**
 * Validates and sanitizes a search query string
 * @param query - The search query to validate
 * @returns Validated and sanitized query, or undefined if invalid
 */
export function validateSearchQuery(
  query: string | null | undefined
): string | undefined {
  if (!query || typeof query !== 'string') {
    return undefined
  }

  // Trim whitespace
  const trimmed = query.trim()

  // Check length constraints
  if (trimmed.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
    return undefined
  }

  if (trimmed.length > SEARCH_CONFIG.MAX_QUERY_LENGTH) {
    return trimmed.substring(0, SEARCH_CONFIG.MAX_QUERY_LENGTH)
  }

  // Basic sanitization - remove potentially dangerous characters
  // Drizzle ORM handles SQL injection, but we add an extra layer
  const sanitized = trimmed.replace(/[<>'"]/g, '')

  return sanitized || undefined
}

/**
 * Builds a search filter for Drizzle ORM using ILIKE (case-insensitive) matching
 * @param searchQuery - The validated search query
 * @param columns - Array of columns to search in
 * @returns Drizzle ORM condition or undefined if no valid query
 */
export function buildSearchFilter<T extends PgColumn>(
  searchQuery: string | undefined,
  columns: T[]
): SQL | undefined {
  if (!searchQuery || columns.length === 0) {
    return undefined
  }

  const conditions = columns.map((column) => ilike(column, `%${searchQuery}%`))

  return conditions.length === 1 ? conditions[0] : or(...conditions)
}
