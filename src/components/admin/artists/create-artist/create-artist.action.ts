'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import { ArtistCreateSchema } from '@/lib/artists'
import ArtistsService from '@/lib/artists/artists.service'

export type CreateArtistFieldErrors = {
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

export type CreateArtistState = {
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
  errors: CreateArtistFieldErrors
}

async function createArtistAction(
  prevState: CreateArtistState,
  formData: FormData
): Promise<CreateArtistState> {
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

  const state: CreateArtistState = {
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

    const services = new ArtistsService()
    await services.create(values)
    revalidateTag('artists')

    return {
      ...state,
      success: true,
      message: 'Artist created successfully!'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ...state,
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as CreateArtistFieldErrors
      }
    }

    console.error(error)
    return {
      ...state,
      success: false,
      message: 'Failed to create artist.',
      errors: {
        database: [(error as Error).message || 'Unknown error occurred']
      }
    }
  }
}

export default createArtistAction
