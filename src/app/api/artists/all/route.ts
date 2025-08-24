import { ArtistsController } from '@/lib/artists/artists.controller'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest } from 'next/server'

const controller = new ArtistsController()

export async function GET(request: NextRequest) {
  try {
    return await controller.getAllArtistsPublic(request)
  } catch (error) {
    return handleApiError(error)
  }
}
