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
  const [state, formAction, isPending] = useActionState(editArtistAction, {
    ...initialFormState,
    ...artist
  })

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
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          placeholder='John Doe'
          defaultValue={state.name}
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
          defaultValue={state.email}
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
          defaultValue={state.photoUrl}
        />
        {state?.errors?.photoUrl && (
          <p className='text-red-500'>{state?.errors.photoUrl.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='biography'>Biography</Label>
        <Input
          id='biography'
          name='biography'
          type='text'
          placeholder='Artist biography...'
          defaultValue={state.biography}
        />
        {state?.errors?.biography && (
          <p className='text-red-500'>{state?.errors.biography.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='specialization'>Specialization</Label>
        <Input
          id='specialization'
          name='specialization'
          type='text'
          placeholder='Oil painting, Digital art, etc.'
          defaultValue={state.specialization}
        />
        {state?.errors?.specialization && (
          <p className='text-red-500'>
            {state?.errors.specialization.join(', ')}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='location'>Location</Label>
        <Input
          id='location'
          name='location'
          type='text'
          placeholder='City, Country'
          defaultValue={state.location}
        />
        {state?.errors?.location && (
          <p className='text-red-500'>{state?.errors.location.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='website'>Website</Label>
        <Input
          id='website'
          name='website'
          type='url'
          placeholder='https://example.com'
          defaultValue={state.website}
        />
        {state?.errors?.website && (
          <p className='text-red-500'>{state?.errors.website.join(', ')}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='statement'>Artist Statement</Label>
        <Input
          id='statement'
          name='statement'
          type='text'
          placeholder='Artist statement...'
          defaultValue={state.statement}
        />
        {state?.errors?.statement && (
          <p className='text-red-500'>{state?.errors.statement.join(', ')}</p>
        )}
      </div>

      <div className='flex w-full justify-end pt-4'>
        {state?.success === false && (
          <p className='text-red-500'>{state.message}</p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Adding artist...' : 'Add artist'}
        </Button>
      </div>
    </form>
  )
}

export default EditArtistForm
