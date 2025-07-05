'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Media } from '@/lib/media/model/media.schema'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMedia = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMediaList()
      setMediaList(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    try {
      await uploadMedia(formData)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await loadMedia()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto max-w-2xl p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Media Manager</h1>
      <form onSubmit={handleUpload} className='mb-6 flex items-center gap-2'>
        <input
          ref={fileInputRef}
          type='file'
          name='file'
          accept='image/*'
          required
          className='rounded border px-2 py-1'
        />
        <button
          type='submit'
          className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          disabled={loading}
        >
          Upload
        </button>
      </form>
      {error && <div className='mb-2 text-red-600'>{error}</div>}
      {loading && <div>Loading...</div>}
      <div className='grid grid-cols-2 gap-4'>
        {mediaList.map((media) => (
          <div
            key={media.id}
            className='flex flex-col items-center rounded border p-2'
          >
            <Image
              src={`/api/media/${media.id}`}
              alt={media.fileName}
              width={320}
              height={160}
              className='mb-2 h-40 w-full bg-gray-100 object-contain'
              style={{ objectFit: 'contain' }}
            />
            <div className='w-full truncate text-xs text-gray-700'>
              {media.fileName}
            </div>
            <button
              onClick={() => handleDelete(media.id)}
              className='mt-2 text-xs text-red-600 hover:underline'
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
