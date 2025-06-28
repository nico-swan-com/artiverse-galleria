'use server'

import { z } from 'zod'
import ProductsService from '@/lib/products/products.service'
import { revalidateTag } from 'next/cache'

export type ProductFormFieldErrors = {
  name?: string[]
  price?: string[]
  stock?: string[]
  category?: string[]
  images?: string[]
  database?: string[]
}

export type ProductFormState = {
  success: boolean
  message: string
  errors: ProductFormFieldErrors
}

const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock must be 0 or more').optional(),
  category: z.string().optional()
  // Add more fields as needed
})

export async function productFormAction(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    const name = formData.get('name')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
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
    // Validate
    ProductSchema.parse({ name, price, stock, category })
    const service = new ProductsService()
    await service.create({
      name,
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
    })
    revalidateTag('products')
    return {
      success: true,
      message: 'Product saved successfully!',
      errors: {}
    }
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation error. Please check the fields.',
        errors: error.flatten().fieldErrors as ProductFormFieldErrors
      }
    }
    return {
      success: false,
      message: 'Failed to save product.',
      errors: {
        database: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }
}
