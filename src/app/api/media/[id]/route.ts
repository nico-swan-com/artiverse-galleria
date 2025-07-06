import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/lib/media/media.service'
import sharp, { type Gravity } from 'sharp'
import path from 'path'
import fs from 'fs/promises'

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
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const mediaService = new MediaService()
  try {
    const media = await mediaService.getImageById(id)
    if (!media) {
      return new NextResponse('Not Found', { status: 404 })
    }
    // Only handle Buffer or plain buffer object
    let imageBuffer: Buffer
    if (media.data instanceof Buffer) {
      imageBuffer = media.data
    } else if (isPlainBufferObject(media.data)) {
      imageBuffer = Buffer.from(media.data.data)
    } else {
      throw new Error(
        'Invalid image data: must be Buffer or {type: "Buffer", data: number[]}'
      )
    }
    const url = new URL(req.url)
    const quality = parseInt(url.searchParams.get('quality') || '80', 10)
    const width = url.searchParams.get('width')
      ? parseInt(url.searchParams.get('width')!)
      : undefined
    const height = url.searchParams.get('height')
      ? parseInt(url.searchParams.get('height')!)
      : undefined
    const watermark = url.searchParams.get('watermark') === '1'
    const skipWatermark = url.searchParams.get('skipWatermark') === '1'
    const wmText = url.searchParams.get('wmText') || ''
    const wmLogo = url.searchParams.get('wmLogo') || ''
    const wmPos = (url.searchParams.get('wmPos') as Gravity) || 'southeast'
    const wmOpacity = url.searchParams.get('wmOpacity')
      ? parseFloat(url.searchParams.get('wmOpacity')!)
      : 0.5
    const wmScale = url.searchParams.get('wmScale')
      ? parseFloat(url.searchParams.get('wmScale')!)
      : 0.2

    let processedBuffer: Buffer = imageBuffer
    let processed = false
    let watermarkApplied = false
    let outputFormat = media.mimeType
    let transformer = sharp(imageBuffer)

    // Downscale if requested
    if (width || height) {
      transformer = transformer.resize(width, height, { fit: 'inside' })
      processed = true
    }

    // Format-preserving compression
    if (media.mimeType.includes('jpeg') || media.mimeType.includes('jpg')) {
      transformer = transformer.jpeg({ quality, mozjpeg: true })
      outputFormat = 'image/jpeg'
      processed = true
    } else if (media.mimeType.includes('png')) {
      transformer = transformer.png({ quality, compressionLevel: 9 })
      outputFormat = 'image/png'
      processed = true
    } else if (media.mimeType.includes('webp')) {
      transformer = transformer.webp({ quality })
      outputFormat = 'image/webp'
      processed = true
    }

    // Watermarking (skip for system UI assets)
    if (watermark && !skipWatermark) {
      const imgMeta = await transformer.metadata()
      if (wmLogo) {
        // Load watermark logo from public dir
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
          // Composite watermark
          transformer = transformer.composite([
            {
              input: logoResized,
              gravity: wmPos
            }
          ])
          watermarkApplied = true
        } catch (err) {
          console.warn('Failed to load watermark logo:', err)
        }
      } else if (wmText) {
        // Render text watermark as SVG with opacity
        const fontSize = imgMeta.width
          ? Math.round(imgMeta.width * wmScale * 0.5)
          : 24
        const svg = Buffer.from(`
          <svg width='${imgMeta.width}' height='${imgMeta.height}'>
            <text x='95%' y='95%' text-anchor='end' alignment-baseline='bottom' font-size='${fontSize}' fill='white' fill-opacity='${wmOpacity}' font-family='Arial, sans-serif' stroke='black' stroke-width='2'>${wmText}</text>
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
      }
    } catch (err) {
      // Fallback to original if processing fails
      console.warn('Image processing failed, serving original:', err)
      processedBuffer = imageBuffer
      outputFormat = media.mimeType
      processed = false
      watermarkApplied = false
    }

    // ETag for CDN cache (hash of original + params)
    const etag = `W/"${id}-${quality}-${width || ''}-${height || ''}-${watermark ? 1 : 0}-${wmLogo || wmText || ''}"`
    const headers = new Headers()
    headers.set('Content-Type', outputFormat)
    headers.set('Content-Length', processedBuffer.byteLength.toString())
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('ETag', etag)
    // Log original/processed size and watermark flag
    console.info(
      `Media ${id}: original=${media.fileSize}B, processed=${processedBuffer.byteLength}B, watermark=${watermarkApplied}`
    )
    return new NextResponse(processedBuffer, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * DELETE /api/media/[id] - Deletes media from the database by media ID.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const service = new MediaService()
  const deleted = await service.deleteImage(params.id)
  if (!deleted) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const service = new MediaService()
  const body = await req.json()
  const { fileName, alt, tags } = body
  if (!fileName)
    return NextResponse.json(
      { message: 'File name is required' },
      { status: 400 }
    )
  try {
    const updated = await service.updateImageMeta(params.id, {
      fileName,
      alt,
      tags
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    const error = e as Error
    return NextResponse.json(
      { message: error.message || 'Failed to update media' },
      { status: 500 }
    )
  }
}
