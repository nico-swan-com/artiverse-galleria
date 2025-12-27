import ArtistForm from '@/features/artists/components/admin/ArtistForm'
import ArtistsService from '@/features/artists/lib/artists.service'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Artist } from '@/features/artists'

export default async function EditArtistPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const artistsService = new ArtistsService()
    const artist = await artistsService.getById(id)

    if (!artist) {
      return (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <h2 className='mb-4 text-2xl font-bold'>Artist Not Found</h2>
            <Button asChild>
              <Link href='/admin/artists'>Back to Artists</Link>
            </Button>
          </div>
        </div>
      )
    }

    return <ArtistForm initialArtist={artist as Partial<Artist>} isEdit />
  } catch (error) {
    console.error('Error fetching artist:', error)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>
            Error Loading Artist
          </h2>
          <p className='mb-4 text-gray-600'>
            Unable to load artist at this time. Please try again later.
          </p>
          <Button asChild>
            <Link href='/admin/artists'>Back to Artists</Link>
          </Button>
        </div>
      </div>
    )
  }
}
