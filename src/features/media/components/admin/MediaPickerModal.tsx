import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (selected: string[]) => void
  selectedImages?: string[]
}

interface MediaItem {
  id: string
  fileName: string
  mimeType: string
  fileSize: number
  createdAt: string
}

const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  open,
  onClose,
  onSelect,
  selectedImages = []
}) => {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>(selectedImages)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/media/list')
        if (!res.ok) throw new Error('Failed to fetch media')
        const data = await res.json()
        const all = data.media || []
        setMedia(
          all.map((item: MediaItem) => ({
            ...item,
            createdAt:
              typeof item.createdAt === 'string'
                ? item.createdAt
                : typeof item.createdAt === 'object' &&
                    item.createdAt &&
                    typeof (item.createdAt as Date).toISOString === 'function'
                  ? (item.createdAt as Date).toISOString()
                  : ''
          }))
        )
      } catch {
        setMedia([])
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [open])

  useEffect(() => {
    setSelected(selectedImages)
  }, [selectedImages, open])

  const filtered = media.filter(
    (item) =>
      item.fileName.toLowerCase().includes(search.toLowerCase()) &&
      item.mimeType.startsWith('image/')
  )

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAdd = () => {
    onSelect(selected)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Select Images from Media Library</DialogTitle>
        </DialogHeader>
        <div className='mb-4 flex items-center gap-2'>
          <Input
            placeholder='Search by filename...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full'
            autoFocus
          />
        </div>
        <div className='grid max-h-96 grid-cols-3 gap-4 overflow-y-auto'>
          {loading ? (
            <div className='col-span-3 text-center'>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className='col-span-3 text-center text-muted-foreground'>
              No images found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`group relative cursor-pointer overflow-hidden rounded-lg border ${selected.includes(item.id) ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelect(item.id)}
                tabIndex={0}
                aria-pressed={selected.includes(item.id)}
                role='button'
              >
                <img
                  src={`/api/media/${item.id}`}
                  alt={item.fileName}
                  className='h-32 w-full object-cover'
                />
                <div className='absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-xs text-white'>
                  {item.fileName}
                </div>
                {selected.includes(item.id) && (
                  <div className='absolute right-2 top-2 rounded-full bg-primary p-1 text-xs text-white'>
                    ✓
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <DialogFooter className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' type='button' onClick={onClose}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleAdd}
            disabled={selected.length === 0}
          >
            Add Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MediaPickerModal
