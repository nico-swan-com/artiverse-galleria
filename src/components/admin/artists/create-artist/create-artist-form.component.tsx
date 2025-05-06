'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types'
import createArtistAction from './create-artist.action'

interface CreateArtistFormProps {
  onClose: () => void
}

const initialFormState = {
  ...formInitialState,
  errors: {
    name: [],
    email: [],
    photoUrl: [],
    featured: [],
    styles: [],
    biography: [],
    specialization: [],
    location: [],
    website: [],
    exhibitions: [],
    statement: [],
    database: []
  } as {
    [x: string]: string[] | undefined
    [x: number]: string[] | undefined
    [x: symbol]: string[] | undefined
  },
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
  statement: ''
}

const CreateArtistForm = ({ onClose }: CreateArtistFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createArtistAction,
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

export default CreateArtistForm
