import { Button } from '@/components/ui/button'
import { ProductDelete } from '@/lib/products'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from '@/components/ui/dialog'
import { Trash } from 'lucide-react'
import React, { Suspense, useState } from 'react'
import DeleteProductForm from './ProductDeleteForm'

type DeleteProductProps = {
  product: ProductDelete | null
}

const DeleteProductDialog = ({ product }: DeleteProductProps) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='outline'>
          <Trash className='size-4 text-red-500' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Remove product</DialogTitle>
          <DialogDescription>
            <span
              className='rounded-md bg-red-100 p-4 text-sm text-red-500'
              style={{ display: 'block' }}
            >
              Warning: This action cannot be undone. The product and all
              associated data will be permanently deleted.
              <br />
              <br />
              <strong>Are you sure you want to remove this product?</strong>
            </span>
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          {product && (
            <DeleteProductForm
              product={product}
              onClose={() => setOpen(false)}
            />
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProductDialog
