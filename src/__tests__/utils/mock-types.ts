/**
 * Mock Types for Testing
 *
 * Type-safe mock types for database and service mocks used in tests.
 * These types replace `any` usage in test files.
 */

import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '@/lib/database/schema'
import type Users from '@/features/users/lib/users.service'

type Database = NodePgDatabase<typeof schema>

/**
 * Mock type for Drizzle database query object
 */
export type MockDatabaseQuery = {
  users: {
    findMany: jest.Mock
    findFirst: jest.Mock
  }
  products: {
    findMany: jest.Mock
    findFirst: jest.Mock
  }
  artists: {
    findMany: jest.Mock
    findFirst: jest.Mock
  }
  media: {
    findMany: jest.Mock
    findFirst: jest.Mock
  }
}

/**
 * Mock type for Drizzle database object
 */
export type MockDatabase = {
  query: MockDatabaseQuery
  insert: jest.Mock
  update: jest.Mock
  delete: jest.Mock
  select: jest.Mock
  selectDistinct: jest.Mock
  transaction: jest.Mock
}

/**
 * Mock type for chainable query builder (insert/update/delete)
 */
export type MockChainableQuery = {
  from: jest.Mock
  values: jest.Mock
  set: jest.Mock
  where: jest.Mock
  returning: jest.Mock
  orderBy: jest.Mock
  limit: jest.Mock
  leftJoin: jest.Mock
}

/**
 * Mock type for Users service
 */
export type MockUsersService = {
  getUsers: jest.Mock
  getById: jest.Mock
  create: jest.Mock
  update: jest.Mock
  delete: jest.Mock
}

/**
 * Helper to create a chainable mock object for SQL-like queries
 */
export function createChainableMock(): MockChainableQuery {
  const mock: MockChainableQuery = {
    from: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis()
  }
  return mock
}
