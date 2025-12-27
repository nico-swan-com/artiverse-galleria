import { updateProfileAction } from './profile.actions'
import { auth } from '@/features/authentication/lib/next-auth'
import { db } from '@/lib/database/drizzle'

// Mock dependencies
jest.mock('@/features/authentication/lib/next-auth', () => ({
  auth: jest.fn()
}))

jest.mock('@/lib/database/drizzle', () => ({
  db: {
    update: jest.fn()
  }
}))

jest.mock('@/features/media/lib/media.service', () => ({
  MediaService: jest.fn()
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))

describe('Profile Actions', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>
  const mockDbUpdate = db.update as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateProfileAction', () => {
    const initialState = {
      success: false,
      message: ''
    }

    it('should return error if user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null as never)

      const formData = new FormData()
      formData.append('name', 'Test User')

      const result = await updateProfileAction(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(
        'You must be logged in to update your profile.'
      )
    })

    it('should update profile with name only', async () => {
      mockAuth.mockResolvedValue({
        user: { id: 'user-123' }
      } as never)

      const mockSet = jest.fn().mockReturnThis()
      const mockWhere = jest.fn().mockResolvedValue(undefined)
      mockDbUpdate.mockReturnValue({
        set: mockSet,
        where: mockWhere
      })

      const formData = new FormData()
      formData.append('name', 'Updated Name')

      const result = await updateProfileAction(initialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Profile updated successfully!')
      expect(mockSet).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      mockAuth.mockResolvedValue({
        user: { id: 'user-123' }
      } as never)

      const formData = new FormData()
      formData.append('name', 'A') // Too short

      const result = await updateProfileAction(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validation failed')
      expect(result.errors).toBeDefined()
    })
  })
})
