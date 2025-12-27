import { UsersController } from '@/features/users'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest, NextResponse } from 'next/server'

// Mock dependencies
jest.mock('@/features/users', () => ({
  UsersController: jest.fn()
}))
jest.mock('@/lib/utilities/api-error-handler', () => ({
  handleApiError: jest.fn()
}))
jest.mock('@/lib/security', () => ({
  withRateLimit: jest.fn((_config, handler) => handler),
  RATE_LIMIT_CONFIG: {
    API: { limit: 100, window: 60000 }
  }
}))

describe('Admin Users API Route', () => {
  let mockUsersController: jest.Mocked<UsersController>
  const mockGetUsers = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Create a mock controller instance
    mockUsersController = {
      getUsers: mockGetUsers
    } as unknown as jest.Mocked<UsersController>
    // Mock the constructor to return our mock instance
    ;(
      UsersController as jest.MockedClass<typeof UsersController>
    ).mockImplementation(() => mockUsersController)
  })

  describe('GET /api/admin/users', () => {
    it('should return users list', async () => {
      const { GET } = await import('./route')

      const mockResponse = new NextResponse(
        JSON.stringify({ users: [], total: 0 }),
        { status: 200 }
      )
      mockGetUsers.mockResolvedValue(mockResponse)

      const request = new NextRequest('http://localhost/api/admin/users')
      const response = await GET(request)

      expect(mockGetUsers).toHaveBeenCalledWith(request)
      expect(response).toBe(mockResponse)
    })

    it('should handle errors', async () => {
      const { GET } = await import('./route')

      const error = new Error('Database error')
      mockGetUsers.mockRejectedValue(error)
      const mockErrorResponse = new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      )
      ;(handleApiError as jest.Mock).mockReturnValue(mockErrorResponse)

      const request = new NextRequest('http://localhost/api/admin/users')
      const response = await GET(request)

      expect(handleApiError).toHaveBeenCalledWith(error)
      expect(response).toBe(mockErrorResponse)
    })
  })
})
