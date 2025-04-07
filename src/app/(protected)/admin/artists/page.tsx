import ArtistsPage from '@/components/admin/astists/artists-page.component'
import { Artist, getArtistsUnstableCache } from '@/lib/artists'
import { FindOptionsOrderValue } from 'typeorm'

//type Params = Promise<{ callbackUrl: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const ArtistServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams

  const sortBy = (params.sortBy || 'createdAt') as keyof Artist
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const limit = Number(params.limit || 5)
  const order = (params.order || 'DESC') as FindOptionsOrderValue

  const { artists, total } = await getArtistsUnstableCache(
    { page, limit },
    sortBy,
    order
  )

  return (
    <ArtistsPage
      artists={artists}
      page={page}
      limit={limit}
      total={total}
      sortBy={sortBy}
      order={order}
    />
  )
}

export default ArtistServerPage
