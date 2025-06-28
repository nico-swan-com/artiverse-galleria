'use client'

import Link from 'next/link'
import { Search, PlusCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import PageTransition from '@/components/common/utility/page-transition.component'
import ProductsGridList from './products-grid-list.component'
import { Product } from '@/lib/products'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

type ProductsPageProps = {
  products: Product[]
}

const ProductsPage = ({ products }: ProductsPageProps) => {
  const [productsList] = useState<Product[]>(products)
  const [searchTerm, setSearchTerm] = useState('')

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
            <Link href='/admin/products/new'>
              <Button>
                <PlusCircle size={16} className='mr-2' />
                Add Product
              </Button>
            </Link>
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
