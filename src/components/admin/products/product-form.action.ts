'use server'

import { z } from 'zod'
import ProductsService from '@/lib/products/products.service'
import { revalidateTag } from 'next/cache'
import { ProductCreateSchema, ProductUpdateSchema } from '@/lib/products'

export type ProductFormFieldErrors = {
  name?: string[]
  price?: string[]
  stock?: string[]
  category?: string[]
  database?: string[]
  productType?: string[]
  title?: string[]
  artistId?: string[]
  yearCreated?: string[]
  medium?: string[]
  dimensions?: string[]
  weight?: string[]
  style?: string[]
  availability?: string[]
  featured?: string[]
  images?: string[]
  description?: string[]
  sales?: string[]
}

export type ProductFormState = {
  id?: string
  name?: string
  price?: number
  stock?: number
  category?: string
  database?: string
  productType?: string
  title?: string
  artistId?: string
  yearCreated?: number
  medium?: string
  dimensions?: string
  weight?: string
  style?: string
  availability?: string
  featured?: boolean
  images?: File[]
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
  const name = formData.get('name')?.toString() || ''
  const description = formData.get('description')?.toString() || ''
  const image = formData.get('image') as File | null
  const price = formData.get('price')
    ? Number(formData.get('price'))
    : undefined
  const stock = formData.get('stock')
    ? Number(formData.get('stock'))
    : undefined
  const category = formData.get('category')?.toString() || ''
  const productType = formData.get('productType')?.toString() || 'physical'
  const title = formData.get('title')?.toString() || ''
  const artistId = formData.get('artistId')?.toString() || ''
  const yearCreated = formData.get('yearCreated')?.toString() || ''
  const medium = formData.get('medium')?.toString() || ''
  const dimensions = formData.get('dimensions')?.toString() || ''
  const weight = formData.get('weight')?.toString() || ''
  const style = formData.get('style')?.toString() || ''
  const availability = formData.get('availability')?.toString() || 'Available'
  const featured =
    formData.get('featured') === 'true' || formData.get('featured') === 'on'
  const images = formData.getAll('images') as File[]

  const values = {
    name,
    image,
    price,
    stock,
    category,
    productType,
    title,
    artistId,
    yearCreated: yearCreated ? Number(yearCreated) : undefined,
    medium,
    dimensions,
    weight,
    style,
    availability,
    featured,
    images,
    description,
    sales: 0
  }

  try {
    const service = new ProductsService()
    if (isEdit) {
      const updateValues = ProductUpdateSchema.parse({ ...values, id })
      await service.update(updateValues)
    } else {
      const createValues = ProductCreateSchema.parse({ ...values })
      await service.create(createValues)
    }
    revalidateTag('products')
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
        database: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }
}
