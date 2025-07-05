'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types'
import {
  deleteProductAction,
  DeleteProductState
} from './delete-product.action'
import { ProductDelete } from '@/lib/products'

interface DeleteProductFormProps {
  product: ProductDelete
  onClose: () => void
}

const DeleteProductForm = ({ product, onClose }: DeleteProductFormProps) => {
  const [state, formAction, isPending] = useActionState(
    deleteProductAction,
    formInitialState as DeleteProductState
  )

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      onClose()
    } else if (!state.success && !!state.message && !isPending) {
      toast.error(state.message)
    }
  }, [state, isPending, onClose])

  return (
    <form action={formAction} className='mt-4 space-y-4'>
      <Input
        id='productId'
        name='productId'
        type='hidden'
        defaultValue={product.id}
      />
      <div className='space-y-2'>
        <Label htmlFor='name'>Product Name</Label>
        <Input
          id='name'
          name='name'
          disabled
          defaultValue={product.title}
          aria-describedby='name-description'
        />
        <p id='name-description' className='text-xs text-muted-foreground'>
          This is the product that will be deleted
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          name='description'
          defaultValue={product.description}
          disabled
          aria-describedby='description-description'
        />
        <p
          id='description-description'
          className='text-xs text-muted-foreground'
        >
          Product description for confirmation
        </p>
      </div>

      <div className='flex justify-end pt-4'>
        <Button
          type='submit'
          disabled={isPending}
          className='w-full'
          aria-describedby='submit-description'
        >
          {isPending ? 'Removing product...' : 'Remove product'}
        </Button>
        <p id='submit-description' className='sr-only'>
          Click to permanently delete this product
        </p>
      </div>
    </form>
  )
}

export default DeleteProductForm
