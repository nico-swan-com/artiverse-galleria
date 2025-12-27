'use server'

import { z } from 'zod'
import ProductsService from '@/lib/products/products.service'
import { revalidateTag } from 'next/cache'
import {
  ProductCreateSchema,
  ProductUpdateSchema
} from '@/types/products/product.schema'
import { MediaCreate, MediaService } from '@/lib/media'
import { requireAuth } from '@/lib/authentication/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'

export type ProductFormFieldErrors = {
  title?: string[]
  featureImage?: string[]
  price?: string[]
  stock?: string[]
  category?: string[]
  database?: string[]
  productType?: string[]
  artistId?: string[]
  yearCreated?: string[]
  medium?: string[]
  dimensions?: string[]
  weight?: string[]
  style?: string[]
  featured?: string[]
  images?: string[]
  description?: string[]
  sales?: string[]
}

export type ProductFormState = {
  id?: string
  sku?: number
  title?: string
  featureImage?: File | string
  price?: number
  stock?: number
  category?: string
  database?: string
  productType?: string
  artistId?: string
  yearCreated?: number
  medium?: string
  dimensions?: string
  weight?: string
  style?: string
  availability?: string
  featured?: boolean
  images?: File[] | string[]
  description?: string
  sales?: number
  success: boolean
  message: string
  errors: ProductFormFieldErrors
}

export async function productFormAction(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const id = formData.get('id')?.toString() || ''
  const isEdit = formData.get('isEdit') === 'true'
  const title = formData.get('title')?.toString() || ''
  const description = formData.get('description')?.toString() || ''
  const price = formData.get('price')
    ? Number(formData.get('price'))
    : undefined
  const stock = formData.get('stock')
    ? Number(formData.get('stock'))
    : undefined
  const category = formData.get('category')?.toString() || ''
  const productType = formData.get('productType')?.toString() || 'physical'
  const artistId = formData.get('artistId')?.toString() || ''
  const yearCreated = formData.get('yearCreated')?.toString() || ''
  const medium = formData.get('medium')?.toString() || ''
  const dimensions = formData.get('dimensions')?.toString() || ''
  const weight = formData.get('weight')?.toString() || ''
  const style = formData.get('style')?.toString() || ''
  const featured =
    formData.get('featured') === 'true' || formData.get('featured') === 'on'
  const sku = formData.get('sku') ? Number(formData.get('sku')) : undefined

  const featureImageFile = formData.get('featureImage') as File | undefined
  const imageFiles = formData.getAll('images') as File[]
  let featureImage: string | undefined
  const service = new MediaService()
  if (featureImageFile && featureImageFile instanceof File) {
    const buffer = Buffer.from(await featureImageFile.arrayBuffer())
    const newMedia: MediaCreate = {
      data: buffer,
      mimeType: featureImageFile?.type || '',
      fileSize: featureImageFile?.size || 0,
      fileName: featureImageFile?.name || ''
    }
    const media = await service.uploadImage(newMedia)
    if (media) {
      featureImage = `/api/media/${media.id}`
    }
  } else if (typeof featureImageFile === 'string') {
    featureImage = featureImageFile
  }

  const images: string[] = []

  for (const file of imageFiles) {
    if (!(file instanceof File)) {
      images.push(file)
    } else {
      const buffer = Buffer.from(await file.arrayBuffer())
      const image = await service.uploadImage({
        data: buffer,
        mimeType: file.type,
        fileSize: file.size,
        fileName: file.name
      })
      if (image) {
        images.push(`/api/media/${image.id}`)
      }
    }
  }

  const sales = formData.get('sales')
    ? Number(formData.get('sales'))
    : undefined

  const values = {
    title,
    featureImage,
    price,
    stock,
    category,
    productType,
    artistId,
    yearCreated: yearCreated ? Number(yearCreated) : undefined,
    medium,
    dimensions,
    weight,
    style,
    featured,
    images,
    description,
    sales
  }

  try {
    await requireAuth([
      UserRoles.Admin,
      UserRoles.Editor,
      UserRoles.ShopManager
    ])

    const service = new ProductsService()
    if (isEdit) {
      const updateValues = ProductUpdateSchema.parse({ ...values, id, sku })
      await service.update(updateValues)
    } else {
      const createValues = ProductCreateSchema.parse({ ...values })
      await service.create(createValues)
    }
    revalidateTag('products', 'default')
    return {
      ...values,
      success: true,
      message: 'Product saved successfully!',
      errors: {}
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.flatten().fieldErrors)
      return {
        ...values,
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as ProductFormFieldErrors
      }
    }
    return {
      ...values,
      success: false,
      message: 'Failed to save product.',
      errors: {
        database: ['An unexpected error occurred while saving the product.']
      }
    }
  }
}
