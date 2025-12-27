'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidateTag } from 'next/cache'
import { ArtistCreateSchema } from '@/features/artists'
import ArtistsService from '@/features/artists/lib/artists.service'
import { MediaCreate, MediaService } from '@/features/media'
import { requireAuth } from '@/features/authentication/lib/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'

export type CreateArtistFieldErrors = {
  name?: string[]
  email?: string[]
  image?: string[]
  avatarFile?: string[]
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
  image: string | undefined
  avatarFile?: File
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
  const avatarFile = formData.get('avatarFile') || undefined
  const featured = Boolean(formData.get('featured')?.valueOf()) || false
  const styles = (formData.get('styles')?.toString() || '').split(',')
  const biography = formData.get('biography')?.toString() || ''
  const specialization = formData.get('specialization')?.toString() || ''
  const location = formData.get('location')?.toString() || ''
  const website = formData.get('website')?.toString()
  const exhibitions = (formData.get('exhibitions')?.toString() || '').split(',')
  const statement = formData.get('statement')?.toString() || ''

  let image = getAvatarUrl(email, name)

  if (avatarFile instanceof File) {
    try {
      const mediaService = new MediaService()
      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      const newImage: MediaCreate = {
        fileName: avatarFile.name,
        fileSize: avatarFile.size,
        mimeType: avatarFile.type,
        data: buffer,
        altText: name,
        tags: ['avatar', 'artist', 'profile']
      }
      const newAvatarUrl = await mediaService.uploadImage(newImage)
      image = `/api/media/${newAvatarUrl.id}`
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      return {
        ...prevState,
        success: false,
        message: 'Failed to upload avatar image.',
        errors: {
          avatarFile: ['Failed to upload avatar image']
        }
      }
    }
  }

  const state: CreateArtistState = {
    success: false,
    message: '',
    name,
    email,
    image,
    avatarFile: avatarFile instanceof File ? avatarFile : undefined,
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
    await requireAuth([UserRoles.Admin, UserRoles.Editor])

    const values = ArtistCreateSchema.parse({
      ...state
    })

    const createData = { ...values }
    delete createData.avatarFile

    const services = new ArtistsService()
    await services.create(createData)
    revalidateTag('artists', 'default')

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
