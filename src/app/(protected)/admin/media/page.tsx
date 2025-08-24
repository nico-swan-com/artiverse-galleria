'use client'
import React, { useEffect, useState } from 'react'
import { Media } from '@/lib/media/model/media.schema'
import MediaUploadForm from '@/components/admin/media/MediaUploadForm'
import MediaGridItem from '@/components/admin/media/MediaGridItem'
import EditImageDialogRedesign from '@/components/admin/media/EditImageDialog'
import PageTransition from '@/components/common/utility/PageTransition'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Disable static generation for this page
export const dynamic = 'force-dynamic'

async function fetchMediaList(): Promise<Media[]> {
  const res = await fetch('/api/media', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch media')
  return res.json()
}

async function deleteMedia(id: string) {
  const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete media')
}

async function uploadMedia(formData: FormData) {
  const res = await fetch('/api/media', {
    method: 'POST',
    body: formData
  })
  if (!res.ok) throw new Error('Failed to upload media')
  return res.json()
}

export default function MediaAdminPage() {
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMedia, setEditMedia] = useState<Media | null>(null)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const loadMedia = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMediaList()
      setMediaList(data)
    } catch (e: unknown) {
      const error = e as Error
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    setLoading(true)
    try {
      await deleteMedia(id)
      await loadMedia()
    } catch (e: unknown) {
      const error = e as Error
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (formData: FormData, reset: () => void) => {
    setLoading(true)
    setError(null)
    try {
      await uploadMedia(formData)
      reset()
      await loadMedia()
    } catch (e: unknown) {
      const error = e as Error
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (media: Media) => setEditMedia(media)
  const handleEditDialogClose = () => setEditMedia(null)

  // Compute filtered media
  const filteredMedia = mediaList.filter((media) => {
    const matchesSearch =
      !search ||
      media.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (media.tags &&
        media.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        ))
    const matchesTag =
      !selectedTag || (media.tags && media.tags.includes(selectedTag))
    return matchesSearch && matchesTag
  })

  // Collect all tags for filter dropdown
  const allTags = Array.from(new Set(mediaList.flatMap((m) => m.tags || [])))

  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Media Manager</h1>
            <p className='mt-1 text-muted-foreground'>Manage your images.</p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-between gap-2 sm:flex-row'>
          <Input
            type='text'
            placeholder='Search by file name or tag...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-xs'
          />
          <div className='flex flex-wrap gap-2'>
            <Badge
              variant={!selectedTag ? 'default' : 'secondary'}
              className='cursor-pointer'
              onClick={() => setSelectedTag(null)}
            >
              All Tags
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'secondary'}
                className='cursor-pointer'
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <MediaUploadForm
          onUpload={handleUpload}
          loading={loading}
          existingMedia={mediaList}
        />
        {error && <div className='mb-2 text-red-600'>{error}</div>}
        {loading && <div>Loading...</div>}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredMedia.map((media) => (
            <MediaGridItem
              key={media.id}
              media={media}
              onEdit={() => handleEdit(media)}
              onDelete={handleDelete}
              loading={loading}
            />
          ))}
        </div>
        {editMedia && (
          <EditImageDialogRedesign
            open={!!editMedia}
            onOpenChange={handleEditDialogClose}
            media={editMedia}
            loading={loading}
            onSave={async (meta: {
              fileName?: string
              title?: string
              alt?: string
              altText?: string
              tags: string[]
            }) => {
              if (!editMedia) return
              setLoading(true)
              try {
                await fetch(`/api/media/${editMedia.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    fileName: meta.fileName || meta.title,
                    alt: meta.alt || meta.altText,
                    tags: meta.tags
                  })
                })
                handleEditDialogClose()
                await loadMedia()
              } catch (e) {
                const error = e as Error
                setError(error.message)
              } finally {
                setLoading(false)
              }
            }}
          />
        )}
      </div>
    </PageTransition>
  )
}
