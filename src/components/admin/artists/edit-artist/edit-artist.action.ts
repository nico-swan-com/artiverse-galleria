'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import { Artist, ArtistUpdate, ArtistUpdateSchema } from '@/lib/artists'
import Artists from '@/lib/artists/artists.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function editArtistAction(prevState: any, formData: FormData) {
  const id = formData.get('id')?.toString() || ''
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const photoUrl =
    formData.get('photoUrl')?.toString() || getAvatarUrl(email, name)
  const featured: boolean =
    Boolean(formData.get('featured')?.valueOf()) || false
  const styles: string[] = (formData.get('styles')?.toString() || '').split(',')
  const biography = formData.get('biography')?.toString() || ''
  const specialization = formData.get('specialization')?.toString() || ''
  const location = formData.get('location')?.toString() || ''
  const website = formData.get('website')
  const exhibitions: string[] = (
    formData.get('exhibitions')?.toString() || ''
  ).split(',')
  const statement = formData.get('statement')?.toString() || ''

  const state = {
    id,
    name,
    email,
    photoUrl,
    featured,
    styles,
    biography,
    specialization,
    location,
    website,
    exhibitions,
    statement,
    errors: {
      name: [],
      email: [],
      photoUrl: [],
      featured: [],
      styles: [],
      biography: [],
      specialization: [],
      location: [],
      website: [],
      exhibitions: [],
      statement: []
    } as {
      [x: string]: string[] | undefined
      [x: number]: string[] | undefined
      [x: symbol]: string[] | undefined
    }
  }
  try {
    const values: ArtistUpdate = ArtistUpdateSchema.parse({
      id,
      name,
      email,
      photoUrl,
      featured,
      styles,
      biography,
      specialization,
      location,
      website,
      exhibitions,
      statement
    })

    const services = new Artists()

    await services.update(values)
    revalidateTag('artists')

    return { success: true, message: 'Artist successfully changed!', ...state }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error. Please check the fields.',
        ...state,
        errors: error.flatten().fieldErrors
      }
    } else {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        message: 'Failed to update artist information.',
        ...state,
        errors: {
          database: [errorMessage]
        } as { [x: string]: string[] | undefined }
      }
    }
  }
}

export default editArtistAction
