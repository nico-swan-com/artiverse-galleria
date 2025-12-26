'use server'

/**
 * Media Domain Server Actions
 *
 * Server actions for media-related operations.
 * These actions are called from client components and handle
 * file uploads, deletions, and metadata updates.
 */

import { revalidatePath } from 'next/cache'
import { MediaService } from './media.service'
import { MediaCreate } from './model/media.schema'
import { logger } from '../utilities/logger'
import { MediaNotFoundError, MediaValidationError } from './media.errors'

const mediaService = new MediaService()

/**
 * Upload a new media file
 */
export async function uploadMedia(data: MediaCreate) {
  try {
    const media = await mediaService.uploadImage(data)

    // Revalidate media caches
    revalidatePath('/admin/media')

    return { success: true, data: media }
  } catch (error) {
    logger.error('Failed to upload media', error as Error)
    return {
      success: false,
      error:
        error instanceof MediaValidationError
          ? error.message
          : 'Failed to upload media'
    }
  }
}

/**
 * Delete a media file
 */
export async function deleteMediaAction(id: string) {
  try {
    const deleted = await mediaService.deleteImage(id)

    if (!deleted) {
      throw new MediaNotFoundError(id)
    }

    // Revalidate media caches
    revalidatePath('/admin/media')

    return { success: true }
  } catch (error) {
    logger.error('Failed to delete media', error as Error)
    return {
      success: false,
      error:
        error instanceof MediaNotFoundError
          ? error.message
          : 'Failed to delete media'
    }
  }
}

/**
 * Update media metadata
 */
export async function updateMediaMetadata(
  id: string,
  meta: { fileName: string; alt?: string; tags?: string[] }
) {
  try {
    const media = await mediaService.updateImageMeta(id, meta)

    // Revalidate media caches
    revalidatePath('/admin/media')

    return { success: true, data: media }
  } catch (error) {
    logger.error('Failed to update media metadata', error as Error)
    return {
      success: false,
      error:
        error instanceof MediaNotFoundError ||
        error instanceof MediaValidationError
          ? (error as Error).message
          : 'Failed to update media metadata'
    }
  }
}
