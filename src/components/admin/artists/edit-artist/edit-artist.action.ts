'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import { ArtistUpdate, ArtistUpdateSchema } from '@/lib/artists'
import Artists from '@/lib/artists/artists.service'

export type EditArtistFieldErrors = {
  id?: string[]
  name?: string[]
  email?: string[]
  photoUrl?: string[]
  featured?: string[]
  styles?: string[]
  biography?: string[]
  specialization?: string[]
  location?: string[]
  website?: string[]
  exhibitions?: string[]
  statement?: string[]
  database?: string[]
}

export type EditArtistState = {
  id: string
  success: boolean
  message: string
  name: string
  email: string
  photoUrl: string | undefined
  featured: boolean
  styles: string[]
  biography: string
  specialization: string
  location: string
  website: string | undefined
  exhibitions: string[]
  statement: string
  errors: EditArtistFieldErrors
}

async function editArtistAction(
  prevState: EditArtistState,
  formData: FormData
): Promise<EditArtistState> {
  const id = prevState.id
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const photoUrl =
    formData.get('photoUrl')?.toString() || getAvatarUrl(email, name)
  const featured = Boolean(formData.get('featured')?.valueOf()) || false
  const styles = (formData.get('styles')?.toString() || '').split(',')
  const biography = formData.get('biography')?.toString() || ''
  const specialization = formData.get('specialization')?.toString() || ''
  const location = formData.get('location')?.toString() || ''
  const website = formData.get('website')?.toString()
  const exhibitions = (formData.get('exhibitions')?.toString() || '').split(',')
  const statement = formData.get('statement')?.toString() || ''

  const state: EditArtistState = {
    id,
    success: false,
    message: '',
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
    errors: {}
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

    return {
      ...state,
      success: true,
      message: 'Artist successfully changed!'
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        ...state,
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as EditArtistFieldErrors
      }
    }

    console.error(error)
    return {
      ...state,
      success: false,
      message: 'Failed to update artist information.',
      errors: {
        database: [
          error instanceof Error ? error.message : 'Unknown error occurred'
        ]
      }
    }
  }
}

export default editArtistAction
