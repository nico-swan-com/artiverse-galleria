import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from 'typeorm'
import { ArtistsSortBy } from './model'
import Artists from './artists.service'

export class ArtistsController {
  async getArtistsPublic(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'name') as ArtistsSortBy
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '3', 10)
    const order = (searchParams.get('order') || 'DESC') as FindOptionsOrderValue
    const query = searchParams.get('query')

    const { artists, total } = await new Artists().getPaged(
      { page, limit },
      sortBy,
      order,
      !!query ? query : undefined
    )

    return NextResponse.json({
      artists: artists.map((artist) => {
        delete artist.createdAt
        delete artist.updatedAt
        delete artist.deletedAt
        return artist
      }),
      total
    })
  }
}
