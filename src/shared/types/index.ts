/**
 * Shared Type Definitions
 *
 * Common types and schemas used across the application.
 */

// File handling
export * from './file.schema'

// Common types re-exported from src/types for convenience
export type { PaginationParams } from '@/types/common/pagination-params.type'
export type { FormState } from '@/types/common/form-state.type'
export { formInitialState } from '@/types/common/form-state.type'
export type {
  FindOptionsOrderValue,
  UpdateResult,
  DeleteResult
} from '@/types/common/db.type'
