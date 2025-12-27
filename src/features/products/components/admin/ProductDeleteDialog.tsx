import { Button } from '@/components/ui/button'
import { ProductDelete } from '@/types/products/product.schema'
import { Trash } from 'lucide-react'
import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import DeleteProductForm from './ProductDeleteForm'

type DeleteProductProps = {
  product: ProductDelete | null
}

const DeleteProductDialog = ({ product }: DeleteProductProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <ConfirmDialog
      trigger={
        <Button size='icon' variant='outline' aria-label='Delete product'>
          <Trash className='size-4 text-red-500' />
        </Button>
      }
      title='Remove product'
      description='Warning: This action cannot be undone. The product and all associated data will be permanently deleted. Are you sure you want to remove this product?'
      confirmText='Remove product'
      cancelText='Cancel'
      variant='destructive'
      isOpen={isOpen}
      onOpenChange={setOpen}
      onConfirm={() => {
        // The actual deletion is handled by the form inside
      }}
    >
      {product && (
        <DeleteProductForm product={product} onClose={() => setOpen(false)} />
      )}
    </ConfirmDialog>
  )
}

export default DeleteProductDialog
