'use server'

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { ProductsRepository } from '@/lib/products/products.repository'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteUserAction(prevState: any, formData: FormData) {
  try {
    const ProductIdSchema = z
      .string()
      .nonempty({ message: 'Invalid product ID.' })

    const productId = ProductIdSchema.parse(
      formData.get('productId')?.toString()
    )

    const repository = new ProductsRepository()

    await repository.delete(productId)
    revalidateTag('products')
    revalidatePath('/admin/products')

    return { success: true, message: 'Product removed successfully!' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error(error)
      return {
        success: false,
        message: 'Failed to remove product.',
        errors: {
          database: [error.message]
        }
      }
    }
  }
}

export default deleteUserAction
