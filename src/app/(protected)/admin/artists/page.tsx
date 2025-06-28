import ArtistsPage from '@/components/admin/artists/ArtistsPage'
import { Artist, ArtistsSortBy, isValidArtistsSortKey } from '@/lib/artists'
import Artists from '@/lib/artists/artists.service'
import { instanceToPlain } from 'class-transformer'
import { FindOptionsOrderValue } from 'typeorm'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const ArtistServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams

  const sortBy = (
    typeof params.sortBy === 'string' && isValidArtistsSortKey(params.sortBy)
      ? params.sortBy
      : 'createdAt'
  ) as ArtistsSortBy
  const page = Math.max(1, parseInt((params.page as string) || '1', 10) || 1)
  const limit = Math.min(50, Math.max(1, Number(params.limit || 5) || 5))
  const order = (
    params.order === 'ASC' || params.order === 'DESC' ? params.order : 'DESC'
  ) as FindOptionsOrderValue

  const { artists, total } = await new Artists().getPaged(
    { page, limit },
    sortBy,
    order
  )

  return (
    <ArtistsPage
      artists={instanceToPlain(artists) as Artist[]}
      page={page}
      limit={limit}
      total={total}
      sortBy={sortBy}
      order={order}
    />
  )
}

export default ArtistServerPage
