'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import editArtistAction from './edit-artist.action'
import { Artist } from '@/lib/artists'
import { formInitialState } from '@/types'

interface EditArtistFormProps {
  artist: Artist
  onClose: () => void
}

const EditArtistForm = ({ artist, onClose }: EditArtistFormProps) => {
  const [state, formAction, isPending] = useActionState(
    editArtistAction,
    formInitialState
  )

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      state.message = ''
      onClose()
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
          required
          defaultValue={artist.name}
        />
        {state?.errors?.name && (
          <p className='text-red-500'>{state.errors.name.join(', ')}</p>
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
        {state?.errors?.email && (
          <p className='text-red-500'>{state.errors.email.join(', ')}</p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Updating user...' : 'Update user'}
        </Button>
      </div>
    </form>
  )
}

export default EditArtistForm
