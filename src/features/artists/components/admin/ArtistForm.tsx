'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { artistFormAction, ArtistFormState } from './artist-form.action'
import { Artist } from '@/features/artists'
import AvatarImageInput from '@/features/media/components/admin/AvatarImageInput'
import { getAvatarUrl } from '@/lib/utilities'

interface ArtistFormProps {
  initialArtist?: Partial<Artist>
  isEdit?: boolean
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const defaultArtist: Partial<Artist> = {
  name: '',
  email: '',
  image: undefined,
  featured: false,
  styles: [],
  biography: '',
  specialization: '',
  location: '',
  website: undefined,
  exhibitions: [],
  statement: ''
}

export default function ArtistForm({ initialArtist, isEdit }: ArtistFormProps) {
  const [artist, setArtist] = useState<Partial<Artist>>(
    initialArtist || defaultArtist
  )
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  )
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const router = useRouter()
  const [state, setState] = useState<ArtistFormState>({
    ...artist,
    success: false,
    message: '',
    errors: {}
  })
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (state.success) {
      router.push('/admin/artists')
    }
  }, [state.success, router])

  const handleAvatarChange = (file: File | string | null) => {
    if (file instanceof File) {
      if (file.size > MAX_FILE_SIZE) {
        const sizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(1)
        setAvatarError(
          `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${sizeInMB}MB`
        )
        setAvatarFile(null)
        setAvatarPreview(undefined)
      } else {
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
        setAvatarError(null)
      }
    } else {
      setAvatarFile(null)
      setAvatarPreview(undefined)
      setAvatarError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    if (avatarFile) {
      formData.set('avatarFile', avatarFile)
    } else {
      formData.delete('avatarFile')
    }

    const result = await artistFormAction(state, formData)
    setState(result)
    setIsPending(false)
  }

  return (
    <form
      className='min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8'
      onSubmit={handleSubmit}
    >
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-8 text-3xl font-bold text-gray-900'>
          {isEdit ? 'Edit Artist' : 'Add Artist'}
        </h2>
        <Input
          id='isEdit'
          name='isEdit'
          type='hidden'
          defaultValue={String(isEdit)}
        />
        {isEdit && (
          <Input
            id='id'
            name='id'
            type='hidden'
            defaultValue={artist.id ?? ''}
          />
        )}
        {isEdit && artist.image && (
          <Input
            id='image'
            name='image'
            type='hidden'
            defaultValue={artist.image ?? ''}
          />
        )}

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
          {/* Avatar Image Section */}
          <div className='space-y-6'>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='avatarFile'
              >
                Profile Image
              </Label>
              <AvatarImageInput
                url={
                  avatarPreview ||
                  artist.image ||
                  getAvatarUrl(artist.email || '', artist.name || '')
                }
                onChangeAction={handleAvatarChange}
                maxFileSize={MAX_FILE_SIZE}
                error={avatarError || state.errors?.image?.[0]}
              />
            </div>
          </div>

          {/* Artist Details Section */}
          <div className='space-y-6 lg:col-span-2'>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='name'
              >
                Name *
              </Label>
              <Input
                id='name'
                name='name'
                placeholder='Artist name'
                defaultValue={state.name ?? ''}
                required
                className='mb-1'
              />
              {state?.errors?.name && (
                <p className='text-xs text-red-500'>
                  {state.errors.name.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='email'
              >
                Email *
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='artist@example.com'
                defaultValue={state.email ?? ''}
                required
                className='mb-1'
              />
              {state?.errors?.email && (
                <p className='text-xs text-red-500'>
                  {state.errors.email.join(', ')}
                </p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='specialization'
                >
                  Specialization
                </Label>
                <Input
                  id='specialization'
                  name='specialization'
                  placeholder='Oil painting, Digital art, etc.'
                  defaultValue={state.specialization ?? ''}
                  className='mb-1'
                />
                {state?.errors?.specialization && (
                  <p className='text-xs text-red-500'>
                    {state.errors.specialization.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='location'
                >
                  Location
                </Label>
                <Input
                  id='location'
                  name='location'
                  placeholder='City, Country'
                  defaultValue={state.location ?? ''}
                  className='mb-1'
                />
                {state?.errors?.location && (
                  <p className='text-xs text-red-500'>
                    {state.errors.location.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='biography'
              >
                Biography
              </Label>
              <Textarea
                id='biography'
                name='biography'
                placeholder='Artist biography...'
                rows={4}
                defaultValue={state.biography ?? ''}
                className='mb-1'
              />
              {state?.errors?.biography && (
                <p className='text-xs text-red-500'>
                  {state.errors.biography.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='statement'
              >
                Artist Statement
              </Label>
              <Textarea
                id='statement'
                name='statement'
                placeholder='Artist statement...'
                rows={4}
                defaultValue={state.statement ?? ''}
                className='mb-1'
              />
              {state?.errors?.statement && (
                <p className='text-xs text-red-500'>
                  {state.errors.statement.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='website'
              >
                Website
              </Label>
              <Input
                id='website'
                name='website'
                type='url'
                placeholder='https://example.com'
                defaultValue={state.website ?? ''}
                className='mb-1'
              />
              {state?.errors?.website && (
                <p className='text-xs text-red-500'>
                  {state.errors.website.join(', ')}
                </p>
              )}
            </div>

            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='exhibitions'
              >
                Exhibitions
              </Label>
              <Textarea
                id='exhibitions'
                name='exhibitions'
                placeholder='Enter exhibitions, one per line'
                rows={3}
                defaultValue={
                  Array.isArray(state.exhibitions)
                    ? state.exhibitions.join('\n')
                    : ''
                }
                className='mb-1'
              />
              <p className='text-xs text-muted-foreground'>
                Enter each exhibition on a new line
              </p>
              {state?.errors?.exhibitions && (
                <p className='text-xs text-red-500'>
                  {state.errors.exhibitions.join(', ')}
                </p>
              )}
            </div>

            <div className='mt-2 flex items-center gap-2'>
              <input
                id='featured'
                name='featured'
                type='checkbox'
                checked={!!artist.featured}
                onChange={(e) =>
                  setArtist({ ...artist, featured: e.target.checked })
                }
                className='size-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='featured' className='text-sm font-medium'>
                Featured Artist
              </Label>
            </div>

            <div className='mt-6 flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/admin/artists')}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending || !!avatarError}>
                {isPending
                  ? isEdit
                    ? 'Saving...'
                    : 'Adding...'
                  : isEdit
                    ? 'Save Changes'
                    : 'Add Artist'}
              </Button>
            </div>
            {state?.success === false && (
              <p className='mt-2 text-red-500'>{state.message}</p>
            )}
            {state?.success && (
              <p className='mt-2 text-green-600'>{state.message}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
