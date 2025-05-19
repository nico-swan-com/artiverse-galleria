'use client'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Product } from '@/lib/products'
import { toast } from 'sonner'
import ProductItem from '@/components/admin/products/ProductItem'

type ProductsGridListProps = {
  products: Product[]
}

const ProductsGridList = ({ products }: ProductsGridListProps) => {
  const [productsList, setProductsList] = useState<Product[]>(products)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEditing = false
  ) => {
    const value =
      e.target.name === 'price' || e.target.name === 'stock'
        ? Number(e.target.value)
        : e.target.value

    console.log('value', value, isEditing)
  }

  const handleEditProduct = () => {
    if (!editingProduct) return

    setProductsList(
      productsList.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    )
    setEditingProduct(null)
    setIsEditDialogOpen(false)

    toast.success('Product updated', {
      description: 'The product has been updated successfully.'
    })
  }

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((product) => product.id !== id))
    toast.success('Product deleted', {
      description: 'The product has been deleted.'
    })
  }
  console.debug('productsList', productsList)

  return (
    <>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {productsList.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onEdit={(product) => {
              setEditingProduct(product)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='edit-name'>Product Name *</Label>
                <Input
                  id='edit-name'
                  name='name'
                  placeholder='Enter product name'
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='edit-description'>Description</Label>
                <Textarea
                  id='edit-description'
                  name='description'
                  placeholder='Product description'
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='edit-price'>Price ($) *</Label>
                  <Input
                    id='edit-price'
                    name='price'
                    type='number'
                    min='0'
                    step='0.01'
                    placeholder='0.00'
                    value={editingProduct.price}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='edit-stock'>Stock Quantity</Label>
                  <Input
                    id='edit-stock'
                    name='stock'
                    type='number'
                    min='0'
                    placeholder='0'
                    value={editingProduct.stock}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='edit-category'>Category</Label>
                <Input
                  id='edit-category'
                  name='category'
                  placeholder='Product category'
                  value={editingProduct.category}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='edit-image'>Image URL</Label>
                <Input
                  id='edit-image'
                  name='image'
                  placeholder='Enter image URL'
                  value={editingProduct.image}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default ProductsGridList
