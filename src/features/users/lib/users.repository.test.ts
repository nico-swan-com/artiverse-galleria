import { UsersRepository } from './users.repository'
import { db } from '@/lib/database/drizzle'
import type { NewUser, User } from '@/lib/database/schema'

// Mock dependencies
jest.mock('@/lib/database/drizzle', () => ({
  db: {
    query: {
      users: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    },
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}))

jest.mock('@/lib/utilities/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}))

// Helper to create a chainable mock object for SQL-like queries (insert/update/delete)
const createChainableMock = () => {
  const mock = {
    from: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis()
  }
  return mock
}

type MockDatabase = typeof db

describe('UsersRepository', () => {
  let repository: UsersRepository
  let mockDbInfo: MockDatabase

  beforeEach(() => {
    jest.clearAllMocks()
    repository = new UsersRepository()
    mockDbInfo = db
  })

  describe('getUserById', () => {
    it('should return user without password', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com' }
      mockDbInfo.query.users.findFirst.mockResolvedValue(mockUser)

      const result = await repository.getUserById('user1')
      expect(result).toEqual(mockUser)
      expect(mockDbInfo.query.users.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
          columns: { password: false }
        })
      )
    })

    it('should return null if not found', async () => {
      mockDbInfo.query.users.findFirst.mockResolvedValue(null)
      const result = await repository.getUserById('user1')
      expect(result).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user with properties', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        password: 'hash'
      }
      mockDbInfo.query.users.findFirst.mockResolvedValue(mockUser)

      const result = await repository.getUserByEmail('test@example.com')
      expect(result).toEqual(mockUser)
    })
  })

  describe('create', () => {
    it('should create user and return safe user object', async () => {
      const newUser = {
        email: 'new@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User'
      }
      const createdUser = { id: 'u1', ...newUser, createdAt: new Date() }

      const mockInsert = createChainableMock()
      mockInsert.returning.mockResolvedValue([createdUser])
      ;(db.insert as jest.Mock).mockReturnValue(mockInsert)

      const result = await repository.create(newUser as NewUser)

      expect(result.email).toBe('new@example.com')
      expect((result as User).password).toBeUndefined()
      expect(db.insert).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update user', async () => {
      const updateData = { id: 'u1', firstName: 'Updated' }
      const updatedUser = {
        id: 'u1',
        email: 'test@example.com',
        firstName: 'Updated'
      }

      const mockUpdate = createChainableMock()
      mockUpdate.returning.mockResolvedValue([updatedUser])
      ;(db.update as jest.Mock).mockReturnValue(mockUpdate)

      const result = await repository.update(updateData)

      expect(result.affected).toBe(1)
      expect(db.update).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete user', async () => {
      const mockDelete = createChainableMock()
      mockDelete.where.mockResolvedValue(undefined)
      ;(db.delete as jest.Mock).mockReturnValue(mockDelete)

      const result = await repository.delete('u1')
      expect(result.affected).toBe(1)
    })
  })
})
