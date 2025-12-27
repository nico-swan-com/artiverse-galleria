import { NextRequest, NextResponse } from 'next/server'
import { MediaService, MediaCreate } from '@/features/media'
import { handleApiError, ApiError } from '@/lib/utilities/api-error-handler'
import { withRateLimit, RATE_LIMIT_CONFIG } from '@/lib/security'

export const runtime = 'nodejs'

// GET /api/media - List all media
export const GET = withRateLimit(RATE_LIMIT_CONFIG.API, async () => {
  try {
    const service = new MediaService()
    const all = await service.getAll()
    return NextResponse.json(all)
  } catch (error) {
    return handleApiError(error)
  }
})

// POST /api/media - Upload new image
export const POST = withRateLimit(
  RATE_LIMIT_CONFIG.MEDIA_UPLOAD,
  async (req: NextRequest) => {
    try {
      const form = await req.formData()
      const file = form.get('file')
      if (!file || typeof file === 'string') {
        throw new ApiError(400, 'No file uploaded')
      }
      const service = new MediaService()
      const mediaFile: MediaCreate = {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        data: Buffer.from(await file.arrayBuffer())
      }
      const media = await service.uploadImage(mediaFile)
      return NextResponse.json(media)
    } catch (e: unknown) {
      return handleApiError(e)
    }
  }
)
