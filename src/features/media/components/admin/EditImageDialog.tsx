import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Save, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { Media } from '@/features/media/types/media.schema'

interface EditImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file?: File | null
  media?: Media | null
  onSave: (meta: {
    fileName: string
    altText: string
    tags: string[]
    width?: number
    height?: number
    quality: number
  }) => void
  loading: boolean
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
  open,
  onOpenChange,
  file,
  media,
  onSave,
  loading
}) => {
  const [fileName, setFileName] = useState('')
  const [altText, setAlt] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [quality, setQuality] = useState(90)
  const [lockAspect, setLockAspect] = useState(true)
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null)
  const [estimating, setEstimating] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!open) return
    if (file) {
      setFileName(file.name)
      setAlt(file.name)
      setTags([])
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      const img = new window.Image()
      img.src = url
      img.onload = () => {
        setOriginalDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
        setWidth(img.naturalWidth)
        setHeight(img.naturalHeight)
      }
      return () => URL.revokeObjectURL(url)
    } else if (media) {
      setFileName(media.fileName)
      setAlt(
        (media as Media).altText || (media as Media).altText || media.fileName
      )
      setTags((media as Media).tags || [])
      setPreviewUrl(`/api/media/${media.id}`)
      const img = new window.Image()
      img.src = `/api/media/${media.id}`
      img.onload = () => {
        setOriginalDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
        setWidth(img.naturalWidth)
        setHeight(img.naturalHeight)
      }
    }
  }, [open, file, media])

  useEffect(() => {
    if (!file || !width || !height || !quality) {
      setEstimatedSize(null)
      return
    }
    let cancelled = false
    setEstimating(true)
    imageCompression(file, {
      maxWidthOrHeight: Math.max(width, height),
      maxSizeMB: 10,
      initialQuality: quality / 100,
      useWebWorker: true
    })
      .then((compressed: File) => {
        if (!cancelled) setEstimatedSize(compressed.size)
      })
      .finally(() => {
        if (!cancelled) setEstimating(false)
      })
    return () => {
      cancelled = true
    }
  }, [file, width, height, quality])

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (lockAspect && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height
      setHeight(Math.round(val / ratio))
    }
  }
  const handleHeightChange = (val: number) => {
    setHeight(val)
    if (lockAspect && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(val * ratio))
    }
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }
  const handleTagRemove = (tag: string) =>
    setTags(tags.filter((t) => t !== tag))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    onSave({
      fileName,
      altText,
      tags,
      width,
      height,
      quality
    })
    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Edit Image Metadata & Resize</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-6 md:flex-row'>
            <div className='flex flex-1 flex-col items-center gap-2'>
              {previewUrl ? (
                <Image
                  ref={imgRef}
                  src={previewUrl}
                  alt={altText || fileName}
                  width={width || 320}
                  height={height || 180}
                  className='h-48 w-full rounded bg-gray-100 object-contain'
                />
              ) : (
                <div className='flex h-48 w-full items-center justify-center rounded bg-gray-100'>
                  <ImageIcon className='size-12 text-gray-400' />
                </div>
              )}
              {file && (
                <div className='mt-2 text-xs text-muted-foreground'>
                  {estimating
                    ? 'Estimating size...'
                    : estimatedSize !== null
                      ? `Estimated size: ${(estimatedSize / 1024).toFixed(1)} KB`
                      : null}
                </div>
              )}
              <div className='mt-2 flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {tag}
                    <button
                      type='button'
                      className='ml-1 text-xs'
                      onClick={() => handleTagRemove(tag)}
                      aria-label={`Remove tag ${tag}`}
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className='flex flex-1 flex-col gap-4'>
              <div>
                <Label htmlFor='fileName'>File name</Label>
                <Input
                  id='fileName'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor='altText'>Alt Text</Label>
                <Input
                  id='altText'
                  value={altText}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='tags'>Tags</Label>
                <div className='flex gap-2'>
                  <Input
                    id='tags'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter'
                        ? (e.preventDefault(), handleTagAdd())
                        : undefined
                    }
                    placeholder='Add tag'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleTagAdd}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-2 flex flex-col gap-4 border-t pt-4'>
            <div className='flex items-center gap-4'>
              <Label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className='size-4 rounded border-gray-300 accent-blue-600 focus:ring focus:ring-blue-200'
                />
                Lock aspect ratio
              </Label>
              <Label className='flex items-center gap-2'>
                Quality
                <Slider
                  min={10}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={([val]) => setQuality(val)}
                  className='w-32'
                />
                <span className='w-8 text-right'>{quality}</span>
              </Label>
            </div>
            {originalDimensions && (
              <div className='flex items-center gap-4'>
                <Label className='flex-1'>
                  Width
                  <Slider
                    min={1}
                    max={originalDimensions.width}
                    value={[width || originalDimensions.width]}
                    onValueChange={([val]) => handleWidthChange(val)}
                    className='w-full'
                  />
                  <Input
                    type='number'
                    min={1}
                    max={originalDimensions.width}
                    value={width || ''}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className='ml-2 inline-block w-20'
                  />
                </Label>
                <Label className='flex-1'>
                  Height
                  <Slider
                    min={1}
                    max={originalDimensions.height}
                    value={[height || originalDimensions.height]}
                    onValueChange={([val]) => handleHeightChange(val)}
                    className='w-full'
                  />
                  <Input
                    type='number'
                    min={1}
                    max={originalDimensions.height}
                    value={height || ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className='ml-2 inline-block w-20'
                  />
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type='submit'
              disabled={saving || loading}
              className='flex items-center gap-2'
            >
              <Save className='size-4' /> Save & Apply
            </Button>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditImageDialog
