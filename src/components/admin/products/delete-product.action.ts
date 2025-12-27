'use server'

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { ProductsRepository } from '@/lib/products/products.repository'
import { requireAuth } from '@/lib/authentication/require-auth'
import { UserRoles } from '@/types/users/user-roles.enum'
import { FormState } from '@/types/common/form-state.type'

export async function deleteProductAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await requireAuth([UserRoles.Admin, UserRoles.ShopManager])

    const ProductIdSchema = z
      .string()
      .nonempty({ message: 'Invalid product ID.' })

    const productId = ProductIdSchema.parse(
      formData.get('productId')?.toString()
    )

    const repository = new ProductsRepository()

    await repository.delete(productId)
    revalidateTag('products', 'default')
    revalidatePath('/admin/products')

    return { success: true, message: 'Product removed successfully!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>,
        message: 'Validation error. Please check the fields.'
      }
    } else {
      console.error('Failed to delete product:', error)
      return {
        success: false,
        message: 'Failed to remove product.',
        errors: {
          database: [error instanceof Error ? error.message : 'Unknown error']
        }
      }
    }
  }
}
