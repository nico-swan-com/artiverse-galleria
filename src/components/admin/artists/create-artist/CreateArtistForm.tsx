'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import createArtistAction, { CreateArtistState } from './create-artist.action'
import AvatarImageInput from '../../media/AvatarImageInput'
import { getAvatarUrl } from '@/lib/utilities'

interface CreateArtistFormProps {
  onClose: () => void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes

const initialFormState: CreateArtistState = {
  success: false,
  message: '',
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
  statement: '',
  errors: {}
}

const CreateArtistForm = ({ onClose }: CreateArtistFormProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  )

  const [state, formAction, isPending] = useActionState(
    createArtistAction,
    initialFormState
  )

  useEffect(() => {
    if (!!state.message && !isPending) {
      if (state.success) {
        toast.success(state.message)
        onClose()
      } else {
        console.error(state?.errors)
        toast.error(state.message || 'Failed to create artist')
      }
    }
  }, [state, isPending, onClose])

  useEffect(() => {
    if (avatarFile) {
      setAvatarError(null)
    }
  }, [avatarFile])

  const handleFormAction = (formData: FormData) => {
    setAvatarError(null)

    if (avatarFile && avatarFile.size > MAX_FILE_SIZE) {
      const sizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
      const fileSizeInMB = (avatarFile.size / (1024 * 1024)).toFixed(1)
      setAvatarError(
        `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${sizeInMB}MB`
      )
      return
    }

    if (avatarFile) {
      formData.set('avatarFile', avatarFile)
    } else {
      formData.delete('avatarFile')
    }
    formAction(formData)
  }

  const handleAvatarChange = (file: File | string | null) => {
    if (file instanceof File) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setAvatarError(null)
    } else {
      setAvatarFile(null)
      setAvatarPreview(undefined)
      setAvatarError(null)
    }
  }

  return (
    <form action={handleFormAction} className='mt-4 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='avatarFile'>Profile Image</Label>
        <AvatarImageInput
          url={
            avatarPreview ||
            state.image ||
            getAvatarUrl(state.email || '', state.name || '')
          }
          onChangeAction={handleAvatarChange}
          maxFileSize={MAX_FILE_SIZE}
          error={avatarError || state.errors?.image?.[0]}
        />
      </div>
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
          <p className='text-sm font-medium text-destructive'>
            {state?.errors.name.join(', ')}
          </p>
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
          <p className='text-sm font-medium text-destructive'>
            {state?.errors?.email.join(', ')}
          </p>
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
          <p className='text-sm font-medium text-destructive'>
            {state?.errors.biography.join(', ')}
          </p>
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
          <p className='text-sm font-medium text-destructive'>
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
          <p className='text-sm font-medium text-destructive'>
            {state?.errors.location.join(', ')}
          </p>
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
          <p className='text-sm font-medium text-destructive'>
            {state?.errors.website.join(', ')}
          </p>
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
          <p className='text-sm font-medium text-destructive'>
            {state?.errors.statement.join(', ')}
          </p>
        )}
      </div>

      <div className='flex w-full justify-end pt-4'>
        {state?.success === false && (
          <p className='text-sm font-medium text-destructive'>
            {state.message}
          </p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button
          type='submit'
          disabled={isPending || !!avatarError}
          className='w-full'
        >
          {isPending ? 'Adding artist...' : 'Add artist'}
        </Button>
      </div>
    </form>
  )
}

export default CreateArtistForm
