'use server'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { ArtistsRepository } from '@/lib/artists'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteArtistAction(prevState: any, formData: FormData) {
  try {
    const artistIdIdSchema = z
      .string()
      .uuid({ message: 'Invalid artist ID.' })
      .min(1, { message: 'Artist ID is required.' })

    const artistId = artistIdIdSchema.parse(
      formData.get('artistId')?.toString()
    )

    const repository = new ArtistsRepository()

    await repository.delete(artistId)
    revalidateTag('artists')

    return { success: true, message: 'Artist removed successfully!' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error(error)
      return {
        success: false,
        message: 'Failed to remove artist.',
        errors: {
          database: [error.message]
        }
      }
    }
  }
}

export default deleteArtistAction
