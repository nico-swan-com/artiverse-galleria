import ArtistsList from '@/components/public/artists/ArtistList'
import { Artist } from '@/lib/artists'
import ArtistsService from '@/lib/artists/artists.service'
import { instanceToPlain } from 'class-transformer'

type SearchParams = Promise<{ [key: string]: string | undefined }>

const ArtistsPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams
  const searchQuery = params?.searchQuery || undefined

  const { artists, total } = await new ArtistsService().getAll('name', 'DESC')

  return (
    <ArtistsList
      artists={instanceToPlain(artists) as Artist[]}
      total={total}
      searchQuery={searchQuery}
    ></ArtistsList>
  )
}

export default ArtistsPage
