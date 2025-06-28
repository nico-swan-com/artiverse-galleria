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
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(productFormAction, {
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
      // If editing, show previews for existing images (assume URLs)
      setImagePreviews(initialProduct.images as string[])
    }
  }, [initialProduct])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.name === 'price' || e.target.name === 'stock'
        ? Number(e.target.value)
        : e.target.value
    setProduct({
      ...product,
      [e.target.name]: value
    })
  }

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
    <form
      className='mx-auto max-w-xl py-8'
      action={formAction}
      encType='multipart/form-data'
    >
      <h2 className='mb-4 text-2xl font-bold'>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='name'>Product Name *</Label>
          <Input
            id='name'
            name='name'
            placeholder='Enter product name'
            value={product.name ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            name='description'
            placeholder='Product description'
            rows={3}
            value={product.description ?? ''}
            onChange={handleInputChange}
          />
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
              value={product.price === 0 ? '' : product.price}
              onChange={handleInputChange}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='stock'>Stock Quantity</Label>
            <Input
              id='stock'
              name='stock'
              type='number'
              min='0'
              placeholder='0'
              value={product.stock === 0 ? '' : product.stock}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='category'>Category</Label>
          <Input
            id='category'
            name='category'
            placeholder='Product category'
            value={product.category ?? ''}
            onChange={handleInputChange}
          />
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
          <Label htmlFor='image'>Main Image URL</Label>
          <Input
            id='image-url'
            name='image'
            placeholder='Main image URL (optional)'
            value={product.image ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='productType'>Product Type</Label>
          <Input
            id='productType'
            name='productType'
            placeholder='physical, digital, service, artwork'
            value={product.productType}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            name='title'
            placeholder='Product title (optional)'
            value={product.title ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='artistId'>Artist ID</Label>
          <Input
            id='artistId'
            name='artistId'
            placeholder='Artist ID (optional)'
            value={product.artistId ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='yearCreated'>Year Created</Label>
          <Input
            id='yearCreated'
            name='yearCreated'
            type='number'
            placeholder='Year created (optional)'
            value={product.yearCreated || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='medium'>Medium</Label>
          <Input
            id='medium'
            name='medium'
            placeholder='Medium (optional)'
            value={product.medium ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='dimensions'>Dimensions</Label>
          <Input
            id='dimensions'
            name='dimensions'
            placeholder='Dimensions (optional)'
            value={product.dimensions ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='weight'>Weight</Label>
          <Input
            id='weight'
            name='weight'
            placeholder='Weight (optional)'
            value={product.weight ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='style'>Style</Label>
          <Input
            id='style'
            name='style'
            placeholder='Style (optional)'
            value={product.style ?? ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='availability'>Availability</Label>
          <Input
            id='availability'
            name='availability'
            placeholder='Available, Sold, etc.'
            value={product.availability ?? ''}
            onChange={handleInputChange}
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
