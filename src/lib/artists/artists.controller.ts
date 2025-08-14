import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from 'typeorm'
import { ArtistsSortBy } from './model'
import ArtistsService from './artists.service'

export class ArtistsController {
  async getAllArtistsPublic(request: NextRequest): Promise<Response> {
    const artistsService = new ArtistsService()
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'name') as ArtistsSortBy
    const order = (searchParams.get('order') || 'DESC') as FindOptionsOrderValue

    const { artists, total } = await artistsService.getAll(sortBy, order)

    const sanitizedArtists = artists.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ createdAt, updatedAt, ...rest }) => rest
    )
    return NextResponse.json({
      artists: sanitizedArtists,
      total
    })
  }

  async getArtistsPublic(request: NextRequest): Promise<Response> {
    const artistsService = new ArtistsService()
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'name') as ArtistsSortBy
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '3', 10)
    const order = (searchParams.get('order') || 'DESC') as FindOptionsOrderValue
    const query = searchParams.get('query')

    const { artists, total } = await artistsService.getPaged(
      { page, limit },
      sortBy,
      order,
      query || undefined
    )

    const sanitizedArtists = artists.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ createdAt, updatedAt, ...rest }) => rest
    )
    return NextResponse.json({
      artists: sanitizedArtists,
      total
    })
  }
}
