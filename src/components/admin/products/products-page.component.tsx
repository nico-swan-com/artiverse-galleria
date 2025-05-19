'use client'

import PageTransition from '@/components/common/utility/page-transition.component'
import { Product } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@radix-ui/react-dialog'
import { Search, PlusCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from 'sonner'
import ProductsGridList from './products-grid-list.component'

type ProductsPageProps = {
  products: Product[]
}

const ProductsPage = ({ products }: ProductsPageProps) => {
  const [productsList, setProductsList] = useState<Product[]>(products)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    category: ''
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEditing = false
  ) => {
    const value =
      e.target.name === 'price' || e.target.name === 'stock'
        ? Number(e.target.value)
        : e.target.value

    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [e.target.name]: value
      })
    } else {
      setNewProduct({
        ...newProduct,
        [e.target.name]: value
      })
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || newProduct.price <= 0) {
      toast.error('Missing information', {
        description: 'Please fill all required fields with valid values.'
      })
      return
    }

    const defaultImage =
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'

    const product: Product = {
      id: `p${productsList.length + 1}`,
      name: newProduct.name!,
      description: newProduct.description || 'No description provided.',
      price: newProduct.price!,
      stock: newProduct.stock || 0,
      image: newProduct.image || defaultImage,
      sales: 0,
      category: newProduct.category || 'Uncategorized',
      createdAt: new Date()
    }

    setProductsList([product, ...productsList])
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      category: ''
    })
    setIsAddDialogOpen(false)

    toast.success('Product added', {
      description: 'The product has been added successfully.'
    })
  }

  const filteredProducts = productsList.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageTransition>
      <div className='space-y-6'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
            <p className='mt-1 text-muted-foreground'>
              Manage your product inventory.
            </p>
          </div>
          <div className='flex w-full gap-2 sm:w-auto'>
            <div className='relative flex-1 sm:w-64'>
              <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
              <Input
                placeholder='Search products...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle size={16} className='mr-2' />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='name'>Product Name *</Label>
                    <Input
                      id='name'
                      name='name'
                      placeholder='Enter product name'
                      value={newProduct.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      name='description'
                      placeholder='Product description'
                      rows={3}
                      value={newProduct.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='price'>Price ($) *</Label>
                      <Input
                        id='price'
                        name='price'
                        type='number'
                        min='0'
                        step='0.01'
                        placeholder='0.00'
                        value={newProduct.price === 0 ? '' : newProduct.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='stock'>Stock Quantity</Label>
                      <Input
                        id='stock'
                        name='stock'
                        type='number'
                        min='0'
                        placeholder='0'
                        value={newProduct.stock === 0 ? '' : newProduct.stock}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='category'>Category</Label>
                    <Input
                      id='category'
                      name='category'
                      placeholder='Product category'
                      value={newProduct.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='image'>Image URL</Label>
                    <Input
                      id='image'
                      name='image'
                      placeholder='Enter image URL (optional)'
                      value={newProduct.image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {filteredProducts.length > 0 && (
        <ProductsGridList products={filteredProducts} />
      )}
      {filteredProducts.length === 0 && (
        <div className='py-12 text-center'>
          <h3 className='text-lg font-medium'>No products found</h3>
          <p className='mt-1 text-muted-foreground'>
            {searchTerm
              ? 'Try a different search term.'
              : 'Add your first product to get started.'}
          </p>
        </div>
      )}
    </PageTransition>
  )
}

export default ProductsPage
