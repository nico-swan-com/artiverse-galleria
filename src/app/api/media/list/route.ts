import { NextResponse } from 'next/server'
import { MediaService } from '@/lib/media/media.service'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const service = new MediaService()
    const all = await service.getAll()
    return NextResponse.json({ success: true, media: all })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
