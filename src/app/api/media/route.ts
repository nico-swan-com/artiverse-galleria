import { NextRequest, NextResponse } from 'next/server'
import { MediaService, MediaCreate } from '@/lib/media'
import { handleApiError, ApiError } from '@/lib/utilities/api-error-handler'

export const runtime = 'nodejs'

// GET /api/media - List all media
export async function GET() {
  try {
    const service = new MediaService()
    const all = await service.getAll()
    return NextResponse.json(all)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/media - Upload new image
export async function POST(req: NextRequest) {
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

// DELETE /api/media/:id is handled in [id]/route.ts
