'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import editArtistAction, { EditArtistState } from './edit-artist.action'
import { Artist } from '@/lib/artists'

interface EditArtistFormProps {
  artist: Artist
  onClose: () => void
}

const initialFormState: EditArtistState = {
  id: '',
  name: '',
  email: '',
  photoUrl: '',
  featured: false,
  styles: [],
  biography: '',
  specialization: '',
  location: '',
  website: '',
  exhibitions: [],
  statement: '',
  success: false,
  message: '',
  errors: {}
}

const EditArtistForm = ({ onClose, artist }: EditArtistFormProps) => {
  const [state, formAction, isPending] = useActionState(
    editArtistAction,
    initialFormState
  )

  useEffect(() => {
    if (!!state.message && !isPending) {
      if (state.success) {
        toast.success(state.message)
        state.message = ''
        onClose()
      } else {
        console.error(state?.errors)
      }
    }
  }, [state, isPending, onClose])

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <input id='id' name='id' defaultValue={artist.id} hidden={true} />
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          defaultValue={artist.name}
          required
        />
        {state?.errors?.name && (
          <p className='text-red-500'>{state?.errors.name.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='john@example.com'
          defaultValue={artist.email}
          required
        />
        {state.errors?.email && (
          <p className='text-red-500'>{state?.errors?.email.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='photoUrl'>Photo URL</Label>
        <Input
          id='photoUrl'
          name='photoUrl'
          type='text'
          placeholder='https://example.com/photo.jpg'
          defaultValue={artist.photoUrl}
        />
        {state?.errors?.photoUrl && (
          <p className='text-red-500'>{state?.errors.photoUrl.join(', ')}</p>
        )}
      </div>

      <div className='flex w-full justify-end pt-4'>
        {state?.success === false && (
          <p className='text-red-500'>{state.message}</p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Updating artist...' : 'Update artist'}
        </Button>
      </div>
    </form>
  )
}

export default EditArtistForm
