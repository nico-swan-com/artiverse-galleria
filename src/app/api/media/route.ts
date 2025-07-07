import { NextRequest, NextResponse } from 'next/server'
import { MediaService, MediaCreate } from '@/lib/media'

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
    data: file
  }
  const media = await service.uploadImage(mediaFile)
  return NextResponse.json(media)
}

// DELETE /api/media/:id is handled in [id]/route.ts
