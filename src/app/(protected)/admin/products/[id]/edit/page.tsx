'use server'

import ProductForm from '@/components/admin/products/ProductForm'
import ProductsService from '@/lib/products/products.service'

type Params = Promise<{ id: string }>

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params
  const service = new ProductsService()

  const product = await service.getById(id)
  if (!product) return <div className='p-8 text-center'>Product not found.</div>
  return <ProductForm initialProduct={product} isEdit />
}
