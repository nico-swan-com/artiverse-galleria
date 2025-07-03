import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/lib/media/media.service'

/**
 * GET /api/media/[id] - Streams image data from the database by media ID.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const mediaService = new MediaService()
  try {
    const media = await mediaService.getImageById(id)
    if (!media) {
      return new NextResponse('Not Found', { status: 404 })
    }
    const headers = new Headers()
    headers.set('Content-Type', media.mimeType)
    headers.set('Content-Length', media.fileSize.toString())
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return new NextResponse(media.data, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * DELETE /api/media/[id] - Deletes media from the database by media ID.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const service = new (await import('@/lib/media/media.service')).MediaService()
  const ok = await service.deleteImage(params.id)
  if (ok) return new Response(null, { status: 204 })
  return new Response('Not found', { status: 404 })
}
