'use server'

import ProductForm from '@/components/admin/products/ProductForm'
import ProductsService from '@/lib/products/products.service'
import { instanceToPlain } from 'class-transformer'

type Params = Promise<{ id: string }>

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params
  const service = new ProductsService()

  const product = await service.getById(id)
  if (!product) return <div className='p-8 text-center'>Product not found.</div>
  return <ProductForm initialProduct={instanceToPlain(product)} isEdit />
}
