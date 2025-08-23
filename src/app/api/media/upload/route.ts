import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '@/lib/media/media.service'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('file') as File[]
    if (!files.length) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
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
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
