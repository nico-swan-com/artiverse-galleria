import { NextRequest, NextResponse } from 'next/server'
import { MediaService, MediaCreate } from '@/lib/media'

export const runtime = 'nodejs'

// GET /api/media - List all media
export async function GET() {
  const service = new MediaService()
  const all = await service.getAll()
  return NextResponse.json(all)
}

// POST /api/media - Upload new image
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return new NextResponse('No file uploaded', { status: 400 })
  }
  const service = new MediaService()
  const mediaFile: MediaCreate = {
    fileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
    data: Buffer.from(await file.arrayBuffer())
  }
  try {
    const media = await service.uploadImage(mediaFile)
    return NextResponse.json(media)
  } catch (e: unknown) {
    const error = e as Error & { status?: number }
    if (error.status === 409) {
      return NextResponse.json({ message: error.message }, { status: 409 })
    }
    if (error.status === 400) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { message: error.message || 'Failed to upload media.' },
      { status: 500 }
    )
  }
}

// DELETE /api/media/:id is handled in [id]/route.ts
