'use client'

import { CircleUserRoundIcon, XIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFileUpload } from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type AvatarImageInputProps = {
  /**
   * Called with the selected image (File | string | null) when changed.
   * Passes null when image is removed.
   */
  onChangeAction: (image: File | string | null) => void
  /**
   * Optionally set the initial image (URL).
   */
  value?: string
}

export default function AvatarImageInput({
  onChangeAction,
  value
}: AvatarImageInputProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: 'image/*',
      initialFiles: value
        ? [
            {
              name: 'avatar',
              size: 0,
              type: '',
              url: value,
              id: 'avatar'
            }
          ]
        : []
    })

  const previewUrl = files[0]?.preview || null
  const fileName = files[0]?.file.name || null

  useEffect(() => {
    if (files[0]) {
      onChangeAction(files[0].file as File)
    } else if (!files[0] && !value) {
      onChangeAction(null)
    }
    // Only run when files or value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, value])

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='relative inline-flex'>
        <Button
          variant='outline'
          className='relative size-16 overflow-hidden p-0 shadow-none'
          onClick={openFileDialog}
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
        >
          {previewUrl ? (
            <Image
              className='size-full object-cover'
              src={previewUrl}
              alt='Preview of uploaded image'
              width={64}
              height={64}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden='true'>
              <CircleUserRoundIcon className='size-4 opacity-60' />
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size='icon'
            className='absolute -right-2 -top-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background'
            aria-label='Remove image'
          >
            <XIcon className='size-3.5' />
          </Button>
        )}
        <input
          {...getInputProps()}
          className='sr-only'
          aria-label='Upload image file'
          tabIndex={-1}
        />
      </div>
      {fileName && <p className='text-xs text-muted-foreground'>{fileName}</p>}
      <p
        aria-live='polite'
        role='region'
        className='mt-2 text-xs text-muted-foreground'
      >
        Avatar upload button
      </p>
    </div>
  )
}
