'use client'

import { CircleUserRoundIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type AvatarImageInputProps = {
  /**
   * Called with the selected image (File | string | null) and its metadata when changed.
   * Passes null when image is removed.
   */
  onChangeAction: (
    image: File | string | null,
    meta?: { name: string; type: string; size: number } | null
  ) => void
  /**
   * Optionally set the initial image (URL).
   */
  url?: string
  /**
   * Maximum file size in bytes (default: 1MB)
   */
  maxFileSize?: number
  /**
   * Error message to display
   */
  error?: string
}

export default function AvatarImageInput({
  onChangeAction,
  url,
  maxFileSize = 1024 * 1024, // 1MB default
  error
}: AvatarImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null) // Clear previous errors

    if (file) {
      // Check file size
      if (file.size > maxFileSize) {
        const sizeInMB = (maxFileSize / (1024 * 1024)).toFixed(1)
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(1)
        setFileError(
          `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${sizeInMB}MB`
        )
        onChangeAction(null, null)
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setFileError('Please select a valid image file')
        onChangeAction(null, null)
        return
      }

      setPreviewUrl(URL.createObjectURL(file))
      onChangeAction(file, {
        name: file.name,
        type: file.type,
        size: file.size
      })
    } else {
      setPreviewUrl(url || null)
      onChangeAction(null, null)
    }
  }

  const clearError = () => {
    setFileError(null)
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='relative inline-flex'>
        <Button
          variant='outline'
          type='button'
          className='relative size-16 overflow-hidden p-0 shadow-none'
          onClick={() => {
            clearError()
            inputRef.current?.click()
          }}
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
        <input
          ref={inputRef}
          type='file'
          className='sr-only'
          aria-label='Upload image file'
          tabIndex={-1}
          name='avatarFile'
          accept='image/*'
          onChange={handleFileChange}
        />
      </div>

      {/* Display file size limit info */}
      <p className='text-xs text-muted-foreground'>
        Max file size: {(maxFileSize / (1024 * 1024)).toFixed(1)}MB
      </p>

      {/* Display errors */}
      {(fileError || error) && (
        <p className='max-w-48 text-center text-sm font-medium text-destructive'>
          {fileError || error}
        </p>
      )}
    </div>
  )
}
