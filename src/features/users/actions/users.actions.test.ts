import { getUsersUnstableCache, createUserUnstableCache } from './users.actions'
import Users from '../lib/users.service'

// Mock dependencies
jest.mock('@/lib/database/drizzle', () => ({
  db: {}
}))

jest.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn
}))

jest.mock('../lib/users.service')

describe('Users Actions', () => {
  let mockUsersService: any

  beforeEach(() => {
    jest.clearAllMocks()
    // Setup mock instance
    mockUsersService = {
      getUsers: jest.fn(),
      create: jest.fn()
    }
    ;(Users as unknown as jest.Mock).mockImplementation(() => mockUsersService)
  })

  describe('getUsersUnstableCache', () => {
    it('should call Users.getUsers', async () => {
      const mockResult = { users: [], total: 0 }
      mockUsersService.getUsers.mockResolvedValue(mockResult)

      const result = await getUsersUnstableCache(
        { page: 1, limit: 10 },
        'name',
        'ASC'
      )

      expect(result).toEqual(mockResult)
      expect(mockUsersService.getUsers).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        'name',
        'ASC'
      )
    })
  })

  describe('createUserUnstableCache', () => {
    it('should call Users.create', async () => {
      const mockUser = { email: 'test@example.com' }
      const mockResult = { id: 'u1', ...mockUser }
      mockUsersService.create.mockResolvedValue(mockResult)

      const result = await createUserUnstableCache(mockUser as any)

      expect(result).toEqual(mockResult)
      expect(mockUsersService.create).toHaveBeenCalledWith(mockUser)
    })
  })
})
