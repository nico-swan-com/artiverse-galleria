/**
 * Media Domain Controller
 *
 * Handles HTTP request/response logic for media operations.
 * Used by API route handlers.
 */

import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '../lib/media.service'
import { logger } from '@/lib/utilities/logger'
import { MediaNotFoundError } from '../lib/media.errors'

const mediaService = new MediaService()

/**
 * Get all media records
 */
export async function getAllMedia() {
  try {
    const media = await mediaService.getAll()
    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    logger.error('Failed to get all media', error as Error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media' },
      { status: 500 }
    )
  }
}

/**
 * Get a single media record by ID
 */
export async function getMediaById(id: string) {
  try {
    const media = await mediaService.getImageById(id)

    if (!media) {
      throw new MediaNotFoundError(id)
    }

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to get media by ID', error as Error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media' },
      { status: 500 }
    )
  }
}

/**
 * Get media image data for serving
 */
export async function getMediaImage(id: string) {
  try {
    const media = await mediaService.getImageById(id)

    if (!media || !media.data) {
      throw new MediaNotFoundError(id)
    }

    // Return the image data with appropriate content type
    // Convert Buffer to Uint8Array for NextResponse compatibility
    const imageData = new Uint8Array(media.data)
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': media.mimeType,
        'Content-Length': media.fileSize.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to serve media image', error as Error)
    return NextResponse.json(
      { success: false, error: 'Failed to serve image' },
      { status: 500 }
    )
  }
}

/**
 * Delete a media record
 */
export async function deleteMedia(id: string) {
  try {
    const deleted = await mediaService.deleteImage(id)

    if (!deleted) {
      throw new MediaNotFoundError(id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to delete media', error as Error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
