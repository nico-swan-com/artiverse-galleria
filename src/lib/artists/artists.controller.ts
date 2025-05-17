import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from 'typeorm'
import { ArtistsSortBy } from './model'
import Artists from './artists.service'

export class ArtistsController {
  private artistsService: Artists

  constructor(artistsService?: Artists) {
    this.artistsService = artistsService || new Artists()
  }

  async getArtistsPublic(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'name') as ArtistsSortBy
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '3', 10)
    const order = (searchParams.get('order') || 'DESC') as FindOptionsOrderValue
    const query = searchParams.get('query')

    const { artists, total } = await this.artistsService.getPaged(
      { page, limit },
      sortBy,
      order,
      query || undefined
    )

    const sanitizedArtists = artists.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ createdAt, updatedAt, deletedAt, ...rest }) => rest
    )
    return NextResponse.json({
      artists: sanitizedArtists,
      total
    })
  }
}
