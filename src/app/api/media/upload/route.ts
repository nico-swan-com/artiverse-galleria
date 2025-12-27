import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/features/media/lib/media.service'
import { handleApiError, ApiError } from '@/lib/utilities/api-error-handler'
import { withRateLimit, RATE_LIMIT_CONFIG } from '@/lib/security'

export const runtime = 'nodejs'

export const POST = withRateLimit(
  RATE_LIMIT_CONFIG.MEDIA_UPLOAD,
  async (req: NextRequest) => {
    try {
      const formData = await req.formData()
      const files = formData.getAll('file') as File[]
      if (!files.length) {
        throw new ApiError(400, 'No file uploaded')
      }
      const service = new MediaService()
      const results = []
      for (const file of files) {
        if (!(file instanceof File)) continue
        const buffer = Buffer.from(await file.arrayBuffer())
        const media = await service.uploadImage({
          data: buffer,
          mimeType: file.type,
          fileSize: file.size,
          fileName: file.name
        })
        results.push({ id: media.id, url: `/api/media/${media.id}` })
      }
      return NextResponse.json({ success: true, files: results })
    } catch (error) {
      return handleApiError(error)
    }
  }
)
