'use client'
import React, { useState } from 'react'
import ProductItem from '@/components/admin/products/ProductItem'
import { Product } from '@/lib/products'

type ProductsGridListProps = {
  products: Product[]
}

const ProductsGridList = ({ products }: ProductsGridListProps) => {
  const [productsList, setProductsList] = useState<Product[]>(products)

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((product) => product.id !== id))
    // Optionally: Add API call to delete product from backend
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {productsList.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onDelete={handleDeleteProduct}
        />
      ))}
    </div>
  )
}

export default ProductsGridList
