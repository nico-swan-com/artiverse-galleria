import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/features/media/lib/media.service'
import sharp, { type Gravity } from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'
import { handleApiError, ApiError } from '@/lib/utilities/api-error-handler'
import { escapeHtml } from '@/lib/utilities/html-escape'
import { IMAGE_CONFIG } from '@/lib/constants/app.constants'
import {
  NotFoundError,
  ValidationError
} from '@/lib/utilities/error-handler.service'
import { logger } from '@/lib/utilities/logger'

function isPlainBufferObject(
  obj: unknown
): obj is { type: 'Buffer'; data: number[] } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj as { type?: string }).type === 'Buffer' &&
    Array.isArray((obj as { data?: unknown }).data)
  )
}

/**
 * Process image with optional resizing, compression, and watermarking
 * Returns the smaller of original or processed image to avoid size inflation
 */
async function processImageBuffer(
  imgBuffer: Buffer,
  mimeType: string,
  options: {
    quality: number
    width?: number
    height?: number
    watermark: boolean
    skipWatermark: boolean
    wmText: string
    wmLogo: string
    wmPos: Gravity
    wmOpacity: number
    wmScale: number
  }
): Promise<{
  buffer: Buffer
  outputFormat: string
  watermarkApplied: boolean
}> {
  const {
    quality,
    width,
    height,
    watermark,
    skipWatermark,
    wmText,
    wmLogo,
    wmPos,
    wmOpacity,
    wmScale
  } = options

  let processedBuffer: Buffer = imgBuffer
  let processed = false
  let watermarkApplied = false
  let outputFormat = mimeType
  let transformer = sharp(imgBuffer)

  // Downscale if requested
  if (width || height) {
    transformer = transformer.resize(width, height, {
      fit: 'inside'
    })
    processed = true
  }

  const isLargeImage = imgBuffer.length > 500 * 1024 // 500KB threshold

  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    transformer = transformer.jpeg({ quality, mozjpeg: true })
    outputFormat = 'image/jpeg'
    processed = true
  } else if (mimeType.includes('png')) {
    // Convert large PNGs to WebP for better compression
    if (isLargeImage) {
      transformer = transformer.webp({ quality, lossless: false })
      outputFormat = 'image/webp'
    } else {
      transformer = transformer.png({
        quality,
        compressionLevel: 9,
        palette: true // Use palette for smaller PNGs
      })
      outputFormat = 'image/png'
    }
    processed = true
  } else if (mimeType.includes('webp')) {
    transformer = transformer.webp({ quality })
    outputFormat = 'image/webp'
    processed = true
  }

  if (watermark && !skipWatermark) {
    const imgMeta = await transformer.metadata()
    if (wmLogo) {
      const logoPath = path.join(process.cwd(), 'public', wmLogo)
      try {
        const logoBuffer = await fs.readFile(logoPath)
        const logoSharp = sharp(logoBuffer)
        // Scale watermark logo
        const logoResized = await logoSharp
          .resize({
            width: imgMeta.width ? Math.round(imgMeta.width * wmScale) : 100
          })
          .png()
          .toBuffer()
        transformer = transformer.composite([
          {
            input: logoResized,
            gravity: wmPos
          }
        ])
        watermarkApplied = true
      } catch (err) {
        logger.warn('Failed to load watermark logo', err, { logoPath })
      }
    } else if (wmText) {
      const fontSize = imgMeta.width
        ? Math.round(imgMeta.width * wmScale * 0.5)
        : 24
      const svg = Buffer.from(`
        <svg width='${imgMeta.width}' height='${imgMeta.height}'>
          <text x='95%' y='95%' text-anchor='end' alignment-baseline='bottom' font-size='${fontSize}' fill='white' fill-opacity='${wmOpacity}' font-family='Arial, sans-serif' stroke='black' stroke-width='2'>${escapeHtml(wmText)}</text>
        </svg>
      `)
      transformer = transformer.composite([
        {
          input: svg,
          gravity: wmPos
        }
      ])
      watermarkApplied = true
    }
    processed = true
  }

  try {
    if (processed) {
      processedBuffer = await transformer.toBuffer()

      if (!watermarkApplied && processedBuffer.length > imgBuffer.length) {
        logger.info('Processed image larger than original, serving original', {
          originalSize: imgBuffer.length,
          processedSize: processedBuffer.length
        })
        processedBuffer = imgBuffer
        outputFormat = mimeType
      }
    }
  } catch (err) {
    logger.warn('Image processing failed, serving original', err)
    processedBuffer = imgBuffer
    outputFormat = mimeType
    watermarkApplied = false
  }

  return {
    buffer: processedBuffer,
    outputFormat,
    watermarkApplied
  }
}

/**
 * GET /api/media/[id] - Streams image data from the database by media ID, with optional compression and watermarking.
 * Query params:
 *   - quality: number (default 80)
 *   - width: number (optional)
 *   - height: number (optional)
 *   - watermark: '1' | '0' (optional)
 *   - wmText: string (optional)
 *   - wmLogo: string (optional, logo file name in /public)
 *   - wmPos: string (e.g. 'bottom-right')
 *   - wmOpacity: number (0-1)
 *   - wmScale: number (0-1, relative to image width)
 *   - skipWatermark: '1' (optional, disables watermark for system UI assets)
 */
export async function GET(req: NextRequest, context: unknown) {
  try {
    const { params } = (context || {}) as { params: Promise<{ id: string }> }
    const mediaService = new MediaService()
    const { id } = await params
    const media = await mediaService.getImageById(id)
    if (!media) {
      throw new NotFoundError('Media', id)
    }
    let imageBuffer: Buffer
    if (media.data instanceof Buffer) {
      imageBuffer = media.data
    } else if (isPlainBufferObject(media.data)) {
      imageBuffer = Buffer.from(media.data.data)
    } else {
      throw new ApiError(
        500,
        'Invalid image data: must be Buffer or {type: "Buffer", data: number[]}'
      )
    }
    const url = new URL(req.url)
    const quality = parseInt(
      url.searchParams.get('quality') ||
        IMAGE_CONFIG.DEFAULT_QUALITY.toString(),
      10
    )
    const width = url.searchParams.get('width')
      ? parseInt(url.searchParams.get('width')!)
      : undefined
    const height = url.searchParams.get('height')
      ? parseInt(url.searchParams.get('height')!)
      : undefined
    const watermark = url.searchParams.get('watermark') === '1'
    const skipWatermark = url.searchParams.get('skipWatermark') === '1'
    const wmText = url.searchParams.get('wmText') || ''
    const wmLogo = path.basename(url.searchParams.get('wmLogo') || '')
    const wmPos =
      (url.searchParams.get('wmPos') as Gravity) ||
      IMAGE_CONFIG.DEFAULT_WATERMARK_POSITION
    const wmOpacity = url.searchParams.get('wmOpacity')
      ? parseFloat(url.searchParams.get('wmOpacity')!)
      : IMAGE_CONFIG.DEFAULT_WATERMARK_OPACITY
    const wmScale = url.searchParams.get('wmScale')
      ? parseFloat(url.searchParams.get('wmScale')!)
      : IMAGE_CONFIG.DEFAULT_WATERMARK_SCALE

    const processed = await processImageBuffer(imageBuffer, media.mimeType, {
      quality,
      width,
      height,
      watermark,
      skipWatermark,
      wmText,
      wmLogo,
      wmPos,
      wmOpacity,
      wmScale
    })
    const processedBuffer = processed.buffer
    const outputFormat = processed.outputFormat
    const watermarkApplied = processed.watermarkApplied

    const etag = `W/"${crypto.createHash('sha256').update(processedBuffer).digest('hex').substring(0, 16)}"`

    const ifNoneMatch = req.headers.get('if-none-match')
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 })
    }

    const headers = new Headers()
    headers.set('Content-Type', outputFormat)
    headers.set('Content-Length', processedBuffer.byteLength.toString())
    const hasTimestamp = url.searchParams.has('t')
    headers.set(
      'Cache-Control',
      hasTimestamp
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : `public, max-age=60, no-cache`
    )
    headers.set('ETag', etag)

    logger.info('Media served', {
      mediaId: id,
      originalSize: media.fileSize,
      processedSize: processedBuffer.byteLength,
      watermarkApplied,
      compressionRatio: (
        (1 - processedBuffer.byteLength / media.fileSize) *
        100
      ).toFixed(1)
    })

    return new NextResponse(new Uint8Array(processedBuffer), {
      status: 200,
      headers
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/media/[id] - Deletes media from the database by media ID.
 */
export async function DELETE(_req: NextRequest, context: unknown) {
  try {
    const { params } = (context || {}) as { params: Promise<{ id: string }> }
    const { id } = await params
    const service = new MediaService()
    const deleted = await service.deleteImage(id)
    if (!deleted) {
      throw new ApiError(404, 'Not found')
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest, context: unknown) {
  try {
    const { params } = (context || {}) as { params: Promise<{ id: string }> }
    const { id } = await params
    const service = new MediaService()
    const body = await req.json()
    const { fileName, alt, tags } = body
    if (!fileName) {
      throw new ValidationError('File name is required', 'fileName')
    }
    const updated = await service.updateImageMeta(id, {
      fileName,
      alt,
      tags
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    return handleApiError(e)
  }
}
