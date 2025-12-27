'use client'

import { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types'
import deleteArtistAction from './delete-artist.action'
import { Artist } from '@/features/artists'

interface DeleteArtistFormProps {
  artist: Artist
  onClose: () => void
}

const DeleteArtistForm = ({ artist, onClose }: DeleteArtistFormProps) => {
  const [state, formAction, isPending] = useActionState(
    deleteArtistAction,
    formInitialState
  )

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      onClose()
    } else if (!state.success && !!state.message && !isPending) {
      toast.error(state.message)
    }
  }, [state, isPending, onClose])

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <Input
        id='artistId'
        name='artistId'
        type='hidden'
        defaultValue={artist.id}
      />
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          disabled
          defaultValue={artist.name}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          defaultValue={artist.email}
          disabled
        />
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Removing artist...' : 'Remove artist'}
        </Button>
      </div>
    </form>
  )
}

export default DeleteArtistForm
