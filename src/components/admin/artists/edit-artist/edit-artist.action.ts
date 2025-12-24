'use server'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { ArtistUpdate, ArtistUpdateSchema } from '@/lib/artists'
import ArtistsService from '@/lib/artists/artists.service'
import { MediaCreate, MediaService } from '@/lib/media'
import { requireAuth } from '@/lib/authentication/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'

export type EditArtistFieldErrors = {
  id?: string[]
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

export type EditArtistState = {
  id: string
  success: boolean
  message: string
  name: string
  email: string
  image: string
  avatarFile?: File
  featured: boolean
  styles: string[]
  biography: string
  specialization: string
  location: string
  website?: string
  exhibitions: string[]
  statement: string
  errors: EditArtistFieldErrors
}

export default async function editArtistAction(
  prevState: EditArtistState,
  formData: FormData
): Promise<EditArtistState> {
  const id = formData.get('id')?.toString() || ''
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const avatarFile = formData.get('avatarFile') as File | null
  let image = formData.get('image')?.toString() || ''

  // Handle avatar file upload if provided
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
    // Authorization: Only Admin or Editor can edit artists
    await requireAuth([UserRoles.Admin, UserRoles.Editor])

    const values: ArtistUpdate = ArtistUpdateSchema.parse({
      ...state
    })

    // Filter out avatarFile as it's not a database field
    const updateData = { ...values }
    delete updateData.avatarFile

    const services = new ArtistsService()
    await services.update(updateData)
    revalidateTag('artists', 'default')

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
