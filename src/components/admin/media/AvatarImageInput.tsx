'use client'

import { CircleUserRoundIcon, Pencil } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import AvatarCropDialog from './AvatarCropDialog'

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
   * Maximum file size in bytes (default: 5MB - higher limit since we crop/compress)
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
  maxFileSize = 5 * 1024 * 1024, // 5MB default (we'll compress after crop)
  error
}: AvatarImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null)
  const [fileError, setFileError] = useState<string | null>(null)

  // Cropper state
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setFileError('Please select a valid image file')
        return
      }

      // Open crop dialog with the selected image
      setOriginalFileName(file.name)
      setImageToCrop(URL.createObjectURL(file))
      setCropDialogOpen(true)
    }

    // Reset input so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    const croppedUrl = URL.createObjectURL(croppedFile)
    setPreviewUrl(croppedUrl)
    onChangeAction(croppedFile, {
      name: croppedFile.name,
      type: croppedFile.type,
      size: croppedFile.size
    })
    // Clean up the original image URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop)
    }
    setImageToCrop(null)
  }

  const handleCropCancel = () => {
    // Clean up the image URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop)
    }
    setImageToCrop(null)
  }

  const clearError = () => {
    setFileError(null)
  }

  return (
    <>
      <div className='flex flex-col items-center gap-2'>
        <div className='group relative inline-flex'>
          <Button
            variant='outline'
            type='button'
            className='relative size-24 overflow-hidden rounded-full p-0 shadow-none'
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
                width={96}
                height={96}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div aria-hidden='true'>
                <CircleUserRoundIcon className='size-8 opacity-60' />
              </div>
            )}
            {/* Edit overlay */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
              <Pencil className='size-5 text-white' />
            </div>
          </Button>
          <input
            ref={inputRef}
            type='file'
            className='sr-only'
            aria-label='Upload image file'
            tabIndex={-1}
            name='avatarFile'
            accept='image/*'
            onChange={handleFileSelect}
          />
        </div>

        {/* Display file size limit info */}
        <p className='text-xs text-muted-foreground'>Click to upload & crop</p>

        {/* Display errors */}
        {(fileError || error) && (
          <p className='max-w-48 text-center text-sm font-medium text-destructive'>
            {fileError || error}
          </p>
        )}
      </div>

      {/* Crop Dialog */}
      {imageToCrop && (
        <AvatarCropDialog
          imageSrc={imageToCrop}
          fileName={originalFileName}
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  )
}
