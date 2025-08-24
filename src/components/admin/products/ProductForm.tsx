'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  productFormAction,
  ProductFormState as OrigProductFormState
} from './product-form.action'
import ProductArtistSelect from '@/components/admin/products/ProductArtistSelect'
import MultipleImageInput from '@/components/admin/media/MultipleImageInput'
import FeatureImageInput from '@/components/admin/media/FeatureImageInput'
import MediaPickerModal from '@/components/admin/media/MediaPickerModal'
import { Product } from '@/types/products/product.schema'

interface ProductFormProps {
  initialProduct?: Partial<Product>
  isEdit?: boolean
}

const defaultProduct: Partial<Product> = {
  title: '',
  description: '',
  price: 0,
  stock: 0,
  featureImage: undefined,
  category: '',
  productType: 'physical',
  artistId: '',
  images: [],
  yearCreated: undefined,
  medium: '',
  dimensions: '',
  weight: '',
  style: '',
  featured: false
}

type ProductFormState = Omit<OrigProductFormState, 'images'> & {
  images?: (File | string)[]
}

export default function ProductForm({
  initialProduct,
  isEdit
}: ProductFormProps) {
  const [product, setProduct] = useState<Partial<Product>>(
    initialProduct || defaultProduct
  )
  const [artist, setArtist] = useState<string | undefined>()
  const router = useRouter()
  const [state, setState] = useState<ProductFormState>({
    ...product,
    success: false,
    message: '',
    errors: {}
  })
  const [isPending, setIsPending] = useState(false)
  const [mediaModalOpen, setMediaModalOpen] = useState(false)

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

  // Custom form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)

    if (product.featureImage instanceof File) {
      formData.append('featureImage', product.featureImage)
    }

    // Separate new files and existing URLs
    const filesOrUrls = product.images || []
    const newFiles: File[] = filesOrUrls.filter(
      (img): img is File => img instanceof File
    )
    const existingUrls: string[] = filesOrUrls.filter(
      (img): img is string => typeof img === 'string'
    )
    let uploadedUrls: string[] = []
    // Upload new files if any
    if (newFiles.length > 0) {
      const uploadForm = new FormData()
      newFiles.forEach((file) => uploadForm.append('file', file))
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: uploadForm
      })
      if (res.ok) {
        const data = await res.json()
        uploadedUrls = data.files.map((f: { url: string }) => f.url)
      } else {
        setState({
          ...state,
          success: false,
          message: 'Failed to upload images',
          errors: {}
        })
        setIsPending(false)
        return
      }
    }
    // Merge and normalize all image URLs
    const images = [...existingUrls, ...uploadedUrls]
      .filter(Boolean)
      .map((url) => {
        if (typeof url === 'string' && url.startsWith('/api/media/')) return url
        if (typeof url === 'string' && /^[a-f0-9-]{36}$/.test(url))
          return `/api/media/${url}`
        return ''
      })
      .filter(Boolean)
    // Set images in formData
    formData.delete('images')
    images.forEach((url) => formData.append('images', url))
    // Call server action
    const result = await productFormAction(
      {
        ...state,
        images
      },
      formData
    )
    setState(result)
    setIsPending(false)
  }

  // Add images from media picker
  const handleAddFromMedia = (ids: string[]) => {
    setProduct((prev) => ({
      ...prev,
      images: Array.from(
        new Set([
          ...(prev.images || []),
          ...ids.map((id) => `/api/media/${id}`)
        ])
      )
    }))
  }

  return (
    <form
      className='min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8'
      onSubmit={handleSubmit}
    >
      <MediaPickerModal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={handleAddFromMedia}
        selectedImages={(product.images || [])
          .filter((img) => typeof img === 'string')
          .map((img) =>
            typeof img === 'string' && img.startsWith('/api/media/')
              ? img.replace('/api/media/', '')
              : img
          )}
      />
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-8 text-3xl font-bold text-gray-900'>
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h2>
        <Input
          id='isEdit'
          name='isEdit'
          type='hidden'
          defaultValue={String(isEdit)}
        />
        {isEdit && (
          <>
            <Input
              id='id'
              name='id'
              type='hidden'
              defaultValue={product.id ?? ''}
            />
            <Input
              id='sku'
              name='sku'
              type='hidden'
              defaultValue={product.sku ?? ''}
            />
          </>
        )}
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          {/* Feature Image & Gallery Section */}
          <div className='space-y-6'>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='featureImage'
              >
                Feature Image
              </Label>
              <FeatureImageInput
                initialImage={product.featureImage as string | undefined}
                onChangeAction={(img) => {
                  if (img instanceof File || typeof img === 'string') {
                    setProduct((prev) => ({ ...prev, featureImage: img }))
                  }
                }}
                name='featureImage'
              />
              {state?.errors?.featureImage && (
                <p className='mt-2 text-xs text-red-500'>
                  {state.errors.featureImage.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='images'
              >
                Gallery Images
              </Label>
              <div className='mb-2 flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setMediaModalOpen(true)}
                >
                  Add from Media Library
                </Button>
              </div>
              <MultipleImageInput
                images={(product.images || []) as (File | string)[]}
                onChangeAction={(imgs) =>
                  setProduct((prev) => ({ ...prev, images: imgs }))
                }
              />
              {state?.errors?.images && (
                <p className='mt-2 text-xs text-red-500'>
                  {state.errors.images.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className='space-y-6'>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='title'
              >
                Product Title *
              </Label>
              <Input
                id='title'
                name='title'
                placeholder='Enter product name'
                defaultValue={state.title ?? ''}
                className='mb-1'
              />
              {state?.errors?.title && (
                <p className='text-xs text-red-500'>
                  {state.errors.title.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='description'
              >
                Description
              </Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Product description'
                rows={3}
                defaultValue={state.description ?? ''}
                className='mb-1'
              />
              {state?.errors?.description && (
                <p className='text-xs text-red-500'>
                  {state.errors.description.join(', ')}
                </p>
              )}
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='price'
                >
                  Price ($) *
                </Label>
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
                  className='mb-1'
                />
                {state?.errors?.price && (
                  <p className='text-xs text-red-500'>
                    {state.errors.price.join(', ')}
                  </p>
                )}
              </div>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='stock'
                >
                  Stock Quantity
                </Label>
                <Input
                  id='stock'
                  name='stock'
                  type='number'
                  min='0'
                  placeholder='0'
                  defaultValue={
                    Number(state.stock) === 0 ? '' : (state.stock ?? '')
                  }
                  className='mb-1'
                />
                {state?.errors?.stock && (
                  <p className='text-xs text-red-500'>
                    {state.errors.stock.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='category'
              >
                Category *
              </Label>
              <Input
                id='category'
                name='category'
                placeholder='Product category'
                defaultValue={state.category ?? ''}
                className='mb-1'
                required
                aria-describedby={
                  state?.errors?.category ? 'category-error' : 'category-help'
                }
              />
              {state?.errors?.category && (
                <p id='category-error' className='text-xs text-red-500'>
                  {state.errors.category.join(', ')}
                </p>
              )}
              <p id='category-help' className='text-xs text-muted-foreground'>
                The category helps organize and filter products
              </p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='productType'
                >
                  Product Type
                </Label>
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
              <div>
                <ProductArtistSelect
                  artistId={product.artistId || ''}
                  onChange={(val: string) => setArtist(val)}
                  error={state?.errors?.artistId?.join(', ')}
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='yearCreated'
                >
                  Year Created
                </Label>
                <Input
                  id='yearCreated'
                  name='yearCreated'
                  type='number'
                  placeholder='Year created (optional)'
                  defaultValue={state.yearCreated || ''}
                  className='mb-1'
                />
              </div>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='medium'
                >
                  Medium
                </Label>
                <Input
                  id='medium'
                  name='medium'
                  placeholder='Medium (optional)'
                  defaultValue={state.medium ?? ''}
                  className='mb-1'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='dimensions'
                >
                  Dimensions
                </Label>
                <Input
                  id='dimensions'
                  name='dimensions'
                  placeholder='Dimensions (optional)'
                  defaultValue={state.dimensions ?? ''}
                  className='mb-1'
                />
              </div>
              <div>
                <Label
                  className='mb-2 block text-lg font-semibold'
                  htmlFor='weight'
                >
                  Weight
                </Label>
                <Input
                  id='weight'
                  name='weight'
                  placeholder='Weight (optional)'
                  defaultValue={state.weight ?? ''}
                  className='mb-1'
                />
              </div>
            </div>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='style'
              >
                Style
              </Label>
              <Input
                id='style'
                name='style'
                placeholder='Style (optional)'
                defaultValue={state.style ?? ''}
                className='mb-1'
              />
            </div>
            <div>
              <Label
                className='mb-2 block text-lg font-semibold'
                htmlFor='availability'
              >
                Availability
              </Label>
              <Input
                id='availability'
                name='availability'
                placeholder='Available, Sold, etc.'
                defaultValue={state.availability ?? ''}
                className='mb-1'
              />
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <input
                id='featured'
                name='featured'
                type='checkbox'
                checked={!!product.featured}
                onChange={(e) =>
                  setProduct({ ...product, featured: e.target.checked })
                }
                className='size-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='featured' className='text-sm font-medium'>
                Featured
              </Label>
            </div>
            <div className='mt-6 flex gap-2'>
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
        </div>
      </div>
    </form>
  )
}
