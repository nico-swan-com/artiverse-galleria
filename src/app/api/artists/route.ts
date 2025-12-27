import { ArtistsController } from '@/features/artists/actions/artists.controller'
import { handleApiError } from '@/lib/utilities/api-error-handler'
import { NextRequest } from 'next/server'
import { withRateLimit, RATE_LIMIT_CONFIG } from '@/lib/security'

const controller = new ArtistsController()

export const GET = withRateLimit(
  RATE_LIMIT_CONFIG.API,
  async (request: NextRequest) => {
    try {
      return await controller.getAllArtistsPublic(request)
    } catch (error) {
      return handleApiError(error)
    }
  }
)
