'use client'
import React from 'react'
import ProductItem from '@/features/products/components/admin/ProductItem'
import { Product } from '@/types/products/product.schema'

type ProductsGridListProps = {
  products: Product[]
}

const ProductsGridList = ({ products }: ProductsGridListProps) => {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsGridList
