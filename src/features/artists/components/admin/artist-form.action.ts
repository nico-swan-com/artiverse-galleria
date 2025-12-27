'use server'

import { z } from 'zod'
import { getAvatarUrl } from '@/lib/utilities'
import { revalidatePath, revalidateTag } from 'next/cache'
import { ArtistCreateSchema, ArtistUpdateSchema } from '@/features/artists'
import ArtistsService from '@/features/artists/lib/artists.service'
import { MediaCreate, MediaService } from '@/features/media'
import { requireAuth } from '@/features/authentication/lib/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'

export type ArtistFormFieldErrors = {
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

export type ArtistFormState = {
  id?: string
  success: boolean
  message: string
  name?: string
  email?: string
  image?: string
  avatarFile?: File
  featured?: boolean
  styles?: string[]
  biography?: string
  specialization?: string
  location?: string
  website?: string
  exhibitions?: string[]
  statement?: string
  errors: ArtistFormFieldErrors
}

export async function artistFormAction(
  prevState: ArtistFormState,
  formData: FormData
): Promise<ArtistFormState> {
  const isEdit = formData.get('isEdit') === 'true'
  const id = formData.get('id')?.toString() || ''
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const avatarFile = formData.get('avatarFile') as File | null
  const featured = Boolean(formData.get('featured')?.valueOf()) || false
  const styles = (formData.get('styles')?.toString() || '')
    .split(',')
    .filter(Boolean)
  const biography = formData.get('biography')?.toString() || ''
  const specialization = formData.get('specialization')?.toString() || ''
  const location = formData.get('location')?.toString() || ''
  const website = formData.get('website')?.toString()
  const exhibitionsRaw = formData.get('exhibitions')?.toString() || ''
  const exhibitions = exhibitionsRaw
    .split('\n')
    .map((e) => e.trim())
    .filter(Boolean)
  const statement = formData.get('statement')?.toString() || ''

  let image = isEdit
    ? formData.get('image')?.toString() || ''
    : getAvatarUrl(email, name)

  // Handle avatar file upload if provided
  if (avatarFile instanceof File) {
    try {
      const mediaService = new MediaService()

      // Delete old artist avatar if it exists in media library
      if (isEdit && image && image.startsWith('/api/media/')) {
        const oldMediaId = image.replace('/api/media/', '')
        try {
          await mediaService.deleteImage(oldMediaId)
        } catch (deleteError) {
          console.warn('Failed to delete old artist avatar:', deleteError)
          // Continue with upload even if delete fails
        }
      }

      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      const newImage: MediaCreate = {
        fileName: avatarFile.name,
        fileSize: avatarFile.size,
        mimeType: avatarFile.type,
        data: buffer,
        altText: `${name} - Artist Profile Photo`,
        tags: [
          'artist-avatar',
          'artist',
          name.toLowerCase().replace(/\s+/g, '-')
        ]
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

  const state: ArtistFormState = {
    id: isEdit ? id : undefined,
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

    if (isEdit) {
      // Update existing artist
      const values = ArtistUpdateSchema.parse({ ...state })
      const updateData = { ...values }
      delete updateData.avatarFile

      const services = new ArtistsService()
      await services.update(updateData)
      revalidateTag('artists', 'default')
      revalidatePath(`/admin/artists`)
      revalidatePath(`/admin/artists/${id}/edit`)

      return {
        ...state,
        success: true,
        message: 'Artist updated successfully!'
      }
    } else {
      // Create new artist
      const values = ArtistCreateSchema.parse({ ...state })
      const createData = { ...values }
      delete createData.avatarFile

      const services = new ArtistsService()
      await services.create(createData)
      revalidateTag('artists', 'default')
      revalidatePath('/admin/artists')

      return {
        ...state,
        success: true,
        message: 'Artist created successfully!'
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ...state,
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as ArtistFormFieldErrors
      }
    }

    console.error(error)
    return {
      ...state,
      success: false,
      message: isEdit ? 'Failed to update artist.' : 'Failed to create artist.',
      errors: {
        database: [
          error instanceof Error ? error.message : 'Unknown error occurred'
        ]
      }
    }
  }
}
