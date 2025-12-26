'use server'

import { auth } from '@/lib/authentication/next-auth'
import { db } from '@/lib/database/drizzle'
import { users } from '@/lib/database/schema'
import { revalidatePath } from 'next/cache'
import { FormState } from '@/types/common/form-state.type'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { MediaService } from '@/lib/media/media.service'
import bcryptjs from 'bcryptjs'

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'Password must be at least 8 characters if provided.'
    }),
  avatarFile: z.instanceof(File).optional()
})

export async function updateProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Authenticate User
  const session = await auth()
  const currentUserId = session?.user?.id

  if (!currentUserId) {
    return {
      success: false,
      message: 'You must be logged in to update your profile.'
    }
  }

  // 2. Parse Input
  const rawData = {
    name: formData.get('name'),
    password: formData.get('password') || undefined,
    avatarFile: formData.get('avatarFile') || undefined
  }

  const result = profileSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors
    }
  }

  const { name, password, avatarFile } = result.data

  try {
    // 3. Handle Avatar Upload (if provided)
    let avatarUrl: string | undefined
    if (avatarFile && avatarFile.size > 0) {
      const mediaService = new MediaService()
      const uploadResult = await mediaService.processAndUploadImage(
        avatarFile,
        'avatars'
      )
      avatarUrl = uploadResult.url
    }

    // 4. Update User in DB
    const updateData: Partial<typeof users.$inferSelect> = {
      name,
      updatedAt: new Date()
    }

    if (avatarUrl) {
      updateData.avatar = avatarUrl
    }

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10)
      updateData.password = hashedPassword
    }

    await db.update(users).set(updateData).where(eq(users.id, currentUserId))

    revalidatePath('/profile')
    revalidatePath('/admin/users') // To update avatar in header/lists

    return {
      success: true,
      message: 'Profile updated successfully!',
      avatar: avatarUrl // Pass back new avatar for optimistic UI if needed
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return {
      success: false,
      message: 'Failed to update profile. Please try again.'
    }
  }
}
