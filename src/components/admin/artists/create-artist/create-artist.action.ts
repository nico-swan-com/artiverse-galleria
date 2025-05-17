'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import { ArtistCreateSchema } from '@/lib/artists'
import Artists from '@/lib/artists/artists.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createArtistAction(prevState: any, formData: FormData) {
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
  const website = formData.get('website')?.toString()
  const exhibitions: string[] = (
    formData.get('exhibitions')?.toString() || ''
  ).split(',')
  const statement = formData.get('statement')?.toString() || ''

  const state = {
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
      statement: [],
      database: []
    } as {
      [x: string]: string[] | undefined
      [x: number]: string[] | undefined
      [x: symbol]: string[] | undefined
    }
  }
  try {
    const values = ArtistCreateSchema.parse({
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

    await services.create(values)
    revalidateTag('artists')

    return { success: true, message: 'Artist created successfully!', ...state }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error. Please check the fields.',
        ...state,
        errors: error.flatten().fieldErrors
      }
    } else {
      console.error(error)
      return {
        success: false,
        message: 'Failed to create artist.',
        ...state,
        errors: {
          database: [error.message]
        } as { [x: string]: string[] | undefined }
      }
    }
  }
}

export default createArtistAction
