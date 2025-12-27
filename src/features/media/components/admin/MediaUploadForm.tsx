import React, { useRef, useState } from 'react'
import ConfirmDialog from '@/features/products/components/admin/ConfirmDialog'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'
import EditImageDialog from './EditImageDialog'

interface ImageMetadata {
  fileName: string
  altText: string
  tags: string[]
  width?: number
  height?: number
  quality: number
}

interface MediaUploadFormProps {
  onUpload: (formData: FormData, reset: () => void) => Promise<void>
  loading: boolean
  existingMedia?: { fileName: string; contentHash?: string }[]
}

const sha256 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const MediaUploadForm: React.FC<MediaUploadFormProps> = ({
  onUpload,
  loading,
  existingMedia = []
}) => {
  const [, setError] = useState<string | null>(null)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [, setCtaLabel] = useState('Upload Image')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    setPendingFile(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    if (file.size > 5 * 1024 * 1024) {
      setShowSizeModal(true)
      return
    }
    try {
      setCtaLabel('Checking for duplicates...')
      const hash = await sha256(file)
      const duplicate = existingMedia.find(
        (m) => m.contentHash === hash || m.fileName === file.name
      )
      if (duplicate) {
        setShowDuplicateModal(true)
        return
      }
    } catch {
      const duplicate = existingMedia.find((m) => m.fileName === file.name)
      if (duplicate) {
        setShowDuplicateModal(true)
        return
      }
    } finally {
      setCtaLabel('Upload Image')
    }
    setShowEditDialog(true)
  }

  const handleSubmit = async (meta: ImageMetadata) => {
    if (!pendingFile) {
      setError('No file selected')
      return
    }
    setCtaLabel('Uploading...')
    const formData = new FormData()
    formData.append('file', pendingFile, meta.fileName)
    if (meta) {
      formData.append('fileName', meta.fileName)
      formData.append('alt', meta.altText)
      formData.append('tags', JSON.stringify(meta.tags))
      formData.append('width', meta.width?.toString() || '')
      formData.append('height', meta.height?.toString() || '')
      formData.append('quality', meta.quality?.toString() || '')
    }
    try {
      await onUpload(formData, resetInput)
      toast.success('Image uploaded successfully!')
      setShowEditDialog(false)
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error.message || 'Failed to upload image.')
      setError(error.message)
    } finally {
      setCtaLabel('Upload Image')
    }
  }

  const handleDuplicateContinue = () => {
    setShowDuplicateModal(false)
    setShowEditDialog(true)
  }

  const handleDuplicateCancel = () => {
    setShowDuplicateModal(false)
    resetInput()
  }

  const handleSizeResize = async () => {
    if (!pendingFile) return
    setShowSizeModal(false)
    setCtaLabel('Resizing & Uploading...')
    try {
      const compressed = await imageCompression(pendingFile, {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8
      })
      const renamed = new File([compressed], pendingFile.name, {
        type: compressed.type
      })
      setPendingFile(renamed)
      setShowEditDialog(true)
    } catch (e) {
      const error = e as Error
      toast.error(error.message || 'Failed to compress or upload image.')
      setError(error.message)
      resetInput()
    } finally {
      setCtaLabel('Upload Image')
    }
  }

  const handleSizeCancel = () => {
    setShowSizeModal(false)
    resetInput()
  }

  return (
    <>
      <form className='mb-6 flex flex-col items-center gap-2 sm:flex-row'>
        <label htmlFor='media-upload-file' className='sr-only'>
          File
        </label>
        <input
          id='media-upload-file'
          ref={fileInputRef}
          type='file'
          name='file'
          accept='image/*'
          required
          className='flex-1 rounded border px-2 py-1'
          onChange={handleFileChange}
          disabled={loading}
        />
      </form>
      <ConfirmDialog
        trigger={null}
        isOpen={showDuplicateModal}
        onOpenChange={setShowDuplicateModal}
        title='Duplicate File Detected'
        description='A file with this name/content already exists. Do you want to proceed?'
        confirmText='Continue Upload'
        cancelText='Cancel Upload'
        onConfirm={handleDuplicateContinue}
        onCancel={handleDuplicateCancel}
      />
      <ConfirmDialog
        trigger={null}
        isOpen={showSizeModal}
        onOpenChange={setShowSizeModal}
        title='File Too Large'
        description='The selected file exceeds 5MB. Would you like to resize and compress it before uploading?'
        confirmText='Resize & Upload'
        cancelText='Cancel'
        onConfirm={handleSizeResize}
        onCancel={handleSizeCancel}
      />
      <EditImageDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) {
            resetInput()
          }
        }}
        file={pendingFile}
        onSave={handleSubmit}
        loading={loading}
      />
    </>
  )
}

export default MediaUploadForm
