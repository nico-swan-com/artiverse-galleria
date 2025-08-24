'use client'

import { AlertCircleIcon, ImageUpIcon, XIcon } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'
import React, { useEffect } from 'react'

type FeatureImageInputProps = {
  /**
   * Called with the selected image (File | string | null) when changed.
   * Passes null when image is removed.
   */
  onChangeAction: (image: File | string | null) => void
  /**
   * Optionally set the initial image (URL or file ID).
   */
  initialImage?: string
  /**
   * Name for the hidden field (default: 'featureImage').
   */
  name?: string
}

export default function FeatureImageInput({
  onChangeAction,
  initialImage,
  name = 'featureImage'
}: FeatureImageInputProps) {
  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024 // 5MB default

  // useFileUpload hook manages drag/drop, file state, and errors
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps
    }
  ] = useFileUpload({
    accept: 'image/*',
    maxSize
  })

  // If initialImage is provided, show it as preview (for edit forms)
  const previewUrl = files[0]?.preview || initialImage || null
  const hasFile = !!files[0] || !!initialImage

  // Call onChangeAction when file changes
  useEffect(() => {
    if (files[0]) {
      onChangeAction(files[0].file as File)
    } else if (!files[0] && !initialImage) {
      onChangeAction(null)
    }
    // Only run when files or initialImage changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, initialImage])

  // Remove image handler
  const handleRemove = () => {
    if (files[0]) removeFile(files[0].id)
    onChangeAction(null)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='relative'>
        {/* Drop area */}
        <div
          role='button'
          tabIndex={0}
          aria-label='Upload feature image'
          onClick={openFileDialog}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') && openFileDialog()
          }
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className='has-disabled:pointer-events-none has-disabled:opacity-50 relative flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 outline-none transition-colors hover:bg-accent/50 has-[img]:border-none has-[input:focus]:border-ring has-[input:focus]:ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        >
          <input
            {...getInputProps()}
            className='sr-only'
            aria-label='Upload file'
            accept='image/*'
          />
          {previewUrl ? (
            <div className='absolute inset-0'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || 'Uploaded image'}
                className='size-full object-cover'
              />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
              <div
                className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
                aria-hidden='true'
              >
                <ImageUpIcon className='size-4 opacity-60' />
              </div>
              <p className='mb-1.5 text-sm font-medium'>
                Drop your image here or click to browse
              </p>
              <p className='text-xs text-muted-foreground'>
                Max size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
        {hasFile && (
          <div className='absolute right-4 top-4'>
            <button
              type='button'
              className='z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50'
              onClick={handleRemove}
              aria-label='Remove image'
            >
              <XIcon className='size-4' aria-hidden='true' />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className='flex items-center gap-1 text-xs text-destructive'
          role='alert'
        >
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
