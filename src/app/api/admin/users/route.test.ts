import { GET } from './route'
import { UsersController } from '@/features/users'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest } from 'next/server'

// Mock dependencies
jest.mock('@/features/users', () => ({
  UsersController: jest.fn()
}))

jest.mock('@/lib/utilities/api-error-handler', () => ({
  handleApiError: jest.fn()
}))

describe('Admin Users API Route', () => {
  let mockController: jest.Mocked<UsersController>

  beforeEach(() => {
    jest.clearAllMocks()
    mockController = {
      getUsers: jest.fn()
    } as unknown as jest.Mocked<UsersController>
    ;(
      UsersController as jest.MockedClass<typeof UsersController>
    ).mockImplementation(() => mockController)
  })

  describe('GET /api/admin/users', () => {
    it('should return users list', async () => {
      const mockResponse = new Response(
        JSON.stringify({ users: [], total: 0 }),
        { status: 200 }
      )
      mockController.getUsers.mockResolvedValue(mockResponse)

      const request = new NextRequest('http://localhost/api/admin/users')
      const response = await GET(request)

      expect(mockController.getUsers).toHaveBeenCalledWith(request)
      expect(response).toBe(mockResponse)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockController.getUsers.mockRejectedValue(error)
      const mockErrorResponse = new Response(
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
