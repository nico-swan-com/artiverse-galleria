import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/lib/media/media.service'
import { MediaCreateSchema } from '@/lib/media/model/media.schema'

// GET /api/media - List all media
export async function GET() {
  const service = new MediaService()
  // For demo: fetch all (consider pagination for production)
  const repo = service['mediaRepository']
  const repository = await (
    await import('@/lib/database')
  ).getRepository((await import('@/lib/media/model/media.entity')).MediaEntity)
  const all = await repository.find()
  return NextResponse.json(all)
}

// POST /api/media - Upload new image
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return new NextResponse('No file uploaded', { status: 400 })
  }
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const service = new MediaService()
  const media = await service.uploadImage(
    file.name,
    file.type,
    buffer.length,
    buffer
  )
  return NextResponse.json(media)
}

// DELETE /api/media/:id is handled in [id]/route.ts
