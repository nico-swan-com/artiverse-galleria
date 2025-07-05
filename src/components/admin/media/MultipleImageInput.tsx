'use client'

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon
} from 'lucide-react'
import React, { useEffect } from 'react'

import {
  FileMetadata,
  formatBytes,
  useFileUpload
} from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'

interface MultipleImageInputProps {
  /**
   * Called with the selected image (File | string)[] when changed.
   * Passes null when image is removed.
   */
  onChangeAction: (image: (File | string)[]) => void
  /**
   * Optionally set the initial image (URL or file ID).
   */
  images?: (File | string)[]
}

const getFileIcon = (file: {
  file: File | { type?: string; name?: string }
}) => {
  const fileType =
    file.file && typeof file.file === 'object' && 'type' in file.file
      ? file.file.type || ''
      : ''
  const fileName =
    file.file && typeof file.file === 'object' && 'name' in file.file
      ? file.file.name || ''
      : ''

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes('pdf') ||
        name.endsWith('.pdf') ||
        type.includes('word') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx')
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes('zip') ||
        type.includes('archive') ||
        name.endsWith('.zip') ||
        name.endsWith('.rar')
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes('excel') ||
        name.endsWith('.xls') ||
        name.endsWith('.xlsx')
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes('video/')
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes('audio/')
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith('image/')
    }
  }

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className='size-5 opacity-60' />
    }
  }

  return <FileIcon className='size-5 opacity-60' />
}

const getFilePreview = (file: {
  file: File | { type?: string; name?: string; url?: string }
}) => {
  const fileType =
    file.file && typeof file.file === 'object' && 'type' in file.file
      ? file.file.type || ''
      : ''
  const fileName =
    file.file && typeof file.file === 'object' && 'name' in file.file
      ? file.file.name || ''
      : ''

  const renderImage = (src: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={fileName}
      className='size-full rounded-t-[inherit] object-cover'
    />
  )

  return (
    <div className='flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit] bg-accent'>
      {fileType.startsWith('image/') ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file)
            return renderImage(previewUrl)
          })()
        ) : file.file && 'url' in file.file && file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className='size-5 opacity-60' />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  )
}

export default function MultipleImageInput({
  onChangeAction,
  images = []
}: MultipleImageInputProps) {
  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024 // 5MB default
  const maxFiles = 6

  // Robust mapping from images (File|string)[] to FileMetadata[]
  const fileMetas = images
    .map((img) => {
      if (typeof img === 'string') {
        // Treat as URL
        return {
          url: img,
          type: 'image/',
          id: `url-${btoa(img).replace(/=+$/, '')}` // base64 for uniqueness
        } as FileMetadata
      } else if (img instanceof File) {
        // File object
        return {
          name: img.name,
          size: img.size,
          type: img.type,
          id: `file-${img.name}-${img.size}-${img.lastModified}`,
          file: img,
          url: '' // not needed for File
        } as FileMetadata
      }
      return null
    })
    .filter(Boolean) as FileMetadata[]

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps
    }
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: 'image/*',
    initialFiles: fileMetas
  })

  // Call onChangeAction when files change, only pass image files
  useEffect(() => {
    const imageFiles = files
      .filter((f) => f.file.type && f.file.type.startsWith('image/'))
      .map((f) => {
        // If it's a new File object, return it. If it's an initial image (string URL), return the URL.
        // The onChangeAction expects either File[] or string[]
        return f.file instanceof File
          ? f.file
          : typeof (f.file as { url?: string }).url === 'string'
            ? (f.file as { url: string }).url
            : ''
      })
    onChangeAction(imageFiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  return (
    <div className='flex flex-col gap-2'>
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className='not-data-[files]:justify-center relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
      >
        <input
          {...getInputProps()}
          className='sr-only'
          aria-label='Upload image file'
        />
        {files.length > 0 ? (
          <div className='flex w-full flex-col gap-3'>
            <div className='flex items-center justify-between gap-2'>
              <h3 className='truncate text-sm font-medium'>
                Files ({files.length})
              </h3>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={openFileDialog}
                  type='button'
                >
                  <UploadIcon
                    className='-ms-0.5 size-3.5 opacity-60'
                    aria-hidden='true'
                  />
                  Add files
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearFiles}
                  type='button'
                >
                  <Trash2Icon
                    className='-ms-0.5 size-3.5 opacity-60'
                    aria-hidden='true'
                  />
                  Remove all
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {files.map((file, idx) => (
                <div
                  key={
                    file.id ||
                    (file.file && file.file.name + '-' + file.file.size) ||
                    idx
                  }
                  className='relative flex flex-col rounded-md border bg-background'
                >
                  {getFilePreview(file)}
                  <Button
                    onClick={() => removeFile(file.id)}
                    size='icon'
                    className='absolute -right-2 -top-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background'
                    aria-label='Remove image'
                  >
                    <XIcon className='size-3.5' />
                  </Button>
                  <div className='flex min-w-0 flex-col gap-0.5 border-t p-3'>
                    <p className='truncate text-[13px] font-medium'>
                      {typeof file.file.name === 'string' ? file.file.name : ''}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {typeof file.file.size === 'number' &&
                      !isNaN(file.file.size)
                        ? formatBytes(file.file.size)
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
            <div
              className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
              aria-hidden='true'
            >
              <ImageIcon className='size-4 opacity-60' />
            </div>
            <p className='mb-1.5 text-sm font-medium'>Drop your files here</p>
            <p className='text-xs text-muted-foreground'>
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={openFileDialog}
              type='button'
            >
              <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
              Select images
            </Button>
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
