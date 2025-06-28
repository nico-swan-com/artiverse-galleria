import ProductForm from '@/components/admin/products/product-form.component'
import ProductsService from '@/lib/products/products.service'
import { instanceToPlain } from 'class-transformer'

export default async function EditProductPage(props: {
  params: { id: string }
}) {
  const { params } = props
  // Await params if it's a Promise (Next.js 14+ streaming)
  const awaitedParams =
    typeof params.then === 'function' ? await params : params
  const service = new ProductsService()
  const product = await service.getById(awaitedParams.id)
  if (!product) return <div className='p-8 text-center'>Product not found.</div>
  return <ProductForm initialProduct={instanceToPlain(product)} isEdit />
}
