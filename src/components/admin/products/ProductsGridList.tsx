'use client'
import React, { useState } from 'react'
import ProductItem from '@/components/admin/products/ProductItem'
import { Product } from '@/lib/products'

type ProductsGridListProps = {
  products: Product[]
}

const ProductsGridList = ({ products }: ProductsGridListProps) => {
  const [productsList] = useState<Product[]>(products)

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {productsList.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsGridList
