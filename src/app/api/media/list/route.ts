import { NextResponse } from 'next/server'
import { MediaService } from '@/lib/media/media.service'
import { handleApiError } from '@/lib/utilities/api-error-handler'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const service = new MediaService()
    const all = await service.getAll()
    return NextResponse.json({ success: true, media: all })
  } catch (error) {
    return handleApiError(error)
  }
}
