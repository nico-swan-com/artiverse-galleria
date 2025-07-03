/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'
import { productFormAction, ProductFormState } from './product-form.action'
import { ArtistSelect } from '@/components/common/artists/ArtistSelect'

interface ProductFormProps {
  initialProduct?: Partial<Product>
  isEdit?: boolean
}

const defaultProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: undefined,
  category: '',
  productType: 'physical',
  title: '',
  artistId: '',
  images: [],
  yearCreated: undefined,
  medium: '',
  dimensions: '',
  weight: '',
  style: '',
  availability: 'Available',
  featured: false
}

export default function ProductForm({
  initialProduct,
  isEdit
}: ProductFormProps) {
  const [product, setProduct] = useState<Partial<Product>>(
    initialProduct || defaultProduct
  )
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [artist, setArtist] = useState<string | undefined>()
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(productFormAction, {
    ...product,
    success: false,
    message: '',
    errors: {}
  } as ProductFormState)

  useEffect(() => {
    if (
      initialProduct &&
      initialProduct.images &&
      Array.isArray(initialProduct.images)
    ) {
      setImagePreviews(initialProduct.images as string[])
    }
  }, [initialProduct])

  useEffect(() => {
    if (state.success) {
      router.push('/admin/products')
    }
  }, [state, router])

  useEffect(() => {
    if (artist) {
      setProduct((prev) => ({ ...prev, artistId: artist }))
    }
  }, [artist, state])

  const handleImageRemove = (idx: number) => {
    if (Array.isArray(product.images)) {
      const newImages = [...product.images]
      newImages.splice(idx, 1)
      setProduct({ ...product, images: newImages })
    }
    const newPreviews = [...imagePreviews]
    newPreviews.splice(idx, 1)
    setImagePreviews(newPreviews)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (!files.length) return
    const allFiles = [
      ...(Array.isArray(product.images) ? product.images : []),
      ...files
    ]
    setProduct({ ...product, images: allFiles })
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target?.result as string)
        reader.readAsDataURL(file)
      })
    })
    Promise.all(readers).then((newImgs) =>
      setImagePreviews([...imagePreviews, ...newImgs])
    )
  }

  return (
    <form className='mx-auto max-w-xl py-8' action={formAction}>
      <h2 className='mb-4 text-2xl font-bold'>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>
      {isEdit && (
        <>
          <input type='hidden' name='id' defaultValue={state.id ?? ''} />
          <input type='hidden' name='isEdit' defaultValue='true' />
        </>
      )}
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='name'>Product Name *</Label>
          <Input
            id='name'
            name='name'
            placeholder='Enter product name'
            defaultValue={state.name ?? ''}
          />
          {state?.errors?.name && (
            <p className='text-xs text-red-500'>
              {state.errors.name.join(', ')}
            </p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            name='description'
            placeholder='Product description'
            rows={3}
            defaultValue={state.description ?? ''}
          />
          {state?.errors?.description && (
            <p className='text-xs text-red-500'>
              {state.errors.description.join(', ')}
            </p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='image'>Feature Image</Label>
          <Input id='image' name='image' type='file' accept='image/*' />
          {state?.errors?.images && (
            <p className='text-xs text-red-500'>
              {state.errors.images.join(', ')}
            </p>
          )}
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='price'>Price ($) *</Label>
            <Input
              id='price'
              name='price'
              type='number'
              min='0'
              step='0.01'
              placeholder='0.00'
              defaultValue={
                Number(state.price) === 0 ? '' : (state.price ?? '')
              }
            />
            {state?.errors?.price && (
              <p className='text-xs text-red-500'>
                {state.errors.price.join(', ')}
              </p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='stock'>Stock Quantity</Label>
            <Input
              id='stock'
              name='stock'
              type='number'
              min='0'
              placeholder='0'
              defaultValue={
                Number(state.stock) === 0 ? '' : (state.stock ?? '')
              }
            />
            {state?.errors?.stock && (
              <p className='text-xs text-red-500'>
                {state.errors.stock.join(', ')}
              </p>
            )}
          </div>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='category'>Category</Label>
          <Input
            id='category'
            name='category'
            placeholder='Product category'
            defaultValue={state.category ?? ''}
          />
          {state?.errors?.category && (
            <p className='text-xs text-red-500'>
              {state.errors.category.join(', ')}
            </p>
          )}
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='image'>Images</Label>
          <div
            className='mb-2 cursor-pointer rounded border-2 border-dashed border-gray-300 p-4 text-center transition hover:bg-gray-50'
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Input
              id='image'
              name='image'
              type='file'
              accept='image/*'
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : []
                setProduct({ ...product, images: files })
                const readers = files.map((file) => {
                  return new Promise<string>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = (ev) => resolve(ev.target?.result as string)
                    reader.readAsDataURL(file)
                  })
                })
                Promise.all(readers).then(setImagePreviews)
              }}
            />
            <div className='mt-2 text-xs text-muted-foreground'>
              Drag and drop images here or click to select
            </div>
          </div>
          <div className='mt-2 flex flex-wrap gap-2'>
            {imagePreviews.map((src, idx) => (
              <div key={idx} className='relative'>
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className='size-16 rounded border object-cover'
                />
                <button
                  type='button'
                  className='absolute -right-2 -top-2 rounded-full border border-gray-300 bg-white p-1 text-xs hover:bg-red-100'
                  onClick={() => handleImageRemove(idx)}
                  aria-label='Remove image'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='productType'>Product Type</Label>
          <select
            id='productType'
            name='productType'
            className='block w-full rounded border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-primary focus:outline-none'
            defaultValue={state.productType}
          >
            <option value='physical'>Physical</option>
            <option value='digital'>Digital</option>
            <option value='service'>Service</option>
            <option value='artwork'>Artwork</option>
          </select>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            name='title'
            placeholder='Product title (optional)'
            defaultValue={state.title ?? ''}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='artistId'>Artist</Label>
          <ArtistSelect
            artistId={product.artistId || ''}
            onChange={(val) => setArtist(val)}
          />
          <input type='hidden' name='artistId' value={product.artistId ?? ''} />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='yearCreated'>Year Created</Label>
          <Input
            id='yearCreated'
            name='yearCreated'
            type='number'
            placeholder='Year created (optional)'
            defaultValue={state.yearCreated || ''}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='medium'>Medium</Label>
          <Input
            id='medium'
            name='medium'
            placeholder='Medium (optional)'
            defaultValue={state.medium ?? ''}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='dimensions'>Dimensions</Label>
          <Input
            id='dimensions'
            name='dimensions'
            placeholder='Dimensions (optional)'
            defaultValue={state.dimensions ?? ''}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='weight'>Weight</Label>
          <Input
            id='weight'
            name='weight'
            placeholder='Weight (optional)'
            defaultValue={state.weight ?? ''}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='style'>Style</Label>
          <Input
            id='style'
            name='style'
            placeholder='Style (optional)'
            defaultValue={state.style ?? ''}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='availability'>Availability</Label>
          <Input
            id='availability'
            name='availability'
            placeholder='Available, Sold, etc.'
            defaultValue={state.availability ?? ''}
          />
        </div>
        <div className='flex items-center gap-2'>
          <input
            id='featured'
            name='featured'
            type='checkbox'
            checked={!!product.featured}
            onChange={(e) =>
              setProduct({ ...product, featured: e.target.checked })
            }
          />
          <Label htmlFor='featured'>Featured</Label>
        </div>
        <div className='mt-4 flex gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending
              ? isEdit
                ? 'Saving...'
                : 'Adding...'
              : isEdit
                ? 'Save Changes'
                : 'Add Product'}
          </Button>
        </div>
        {state?.success === false && (
          <p className='mt-2 text-red-500'>{state.message}</p>
        )}
        {state?.success && (
          <p className='mt-2 text-green-600'>{state.message}</p>
        )}
      </div>
    </form>
  )
}
