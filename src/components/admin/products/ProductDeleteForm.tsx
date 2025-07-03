'use client'

import React, { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formInitialState } from '@/types'
import deleteProductAction from './delete-product.action'
import { ProductDelete } from '@/lib/products'

interface DeleteProductFormProps {
  product: ProductDelete
  onClose: () => void
}

const DeleteProductForm = ({ product, onClose }: DeleteProductFormProps) => {
  const [state, formAction, isPending] = useActionState(
    deleteProductAction,
    formInitialState
  )

  useEffect(() => {
    if (state.success && !!state.message && !isPending) {
      toast.success(state.message)
      state.message = ''
      onClose()
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
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' disabled defaultValue={product.name} />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Description</Label>
        <Input
          id='description'
          name='description'
          defaultValue={product.description}
          disabled
        />
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? 'Removing product...' : 'Remove product'}
        </Button>
      </div>
    </form>
  )
}

export default DeleteProductForm
