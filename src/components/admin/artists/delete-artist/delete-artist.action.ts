'use server'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { ArtistsRepository } from '@/lib/artists'

type DeleteArtistState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

async function deleteArtistAction(
  prevState: DeleteArtistState,
  formData: FormData
): Promise<DeleteArtistState> {
  try {
    const artistIdIdSchema = z
      .string()
      .uuid({ message: 'Invalid artist ID.' })
      .min(1, { message: 'Artist ID is required.' })

    const artistId = artistIdIdSchema.parse(
      formData.get('artistId')?.toString()
    )

    const repository = new ArtistsRepository()

    try {
      await repository.delete(artistId)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return {
          success: false,
          message: 'Artist not found.',
          errors: {
            artistId: ['Artist with this ID does not exist.']
          }
        }
      }
      throw error
    }
    revalidateTag('artists')

    return { success: true, message: 'Artist removed successfully!' }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, v as string[]])
        ),
        message: 'Validation error. Please check the fields.'
      }
    } else if (error instanceof Error) {
      console.error(error)
      return {
        success: false,
        message: 'Failed to remove artist.',
        errors: {
          database: [error.message || 'Unknown error occurred']
        }
      }
    } else {
      console.error('Unknown error type:', error)
      return {
        success: false,
        message: 'Failed to remove artist.',
        errors: {
          database: ['An unknown error occurred']
        }
      }
    }
  }
}

export default deleteArtistAction
