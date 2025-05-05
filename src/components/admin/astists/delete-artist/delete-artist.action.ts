'use server'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { ArtistsRepository } from '@/lib/artists'

/**
 * Handles the deletion of an artist based on form data input.
 *
 * Validates the artist ID from the provided {@link formData}, deletes the corresponding artist using the repository, and revalidates the 'artists' cache tag. Returns a success response on successful deletion, or a structured error response if validation fails or an unexpected error occurs.
 *
 * @param prevState - The previous state, not used in this function.
 * @param formData - The form data containing the artist ID to delete.
 * @returns An object indicating success or failure, with a message and error details if applicable.
 */
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
        message: 'Failed to remove user.',
        errors: {
          database: [error.message]
        }
      }
    }
  }
}

export default deleteArtistAction
