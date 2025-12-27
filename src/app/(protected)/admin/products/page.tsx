import ProductsPage from '@/features/products/components/admin/ProductsPage'
import { Product } from '@/types/products/product.schema'
import {
  isValidProductsSortKey,
  ProductsSortBy
} from '@/types/products/products-sort-by.type'
import ProductsService from '@/features/products/lib/products.service'
import { FindOptionsOrderValue } from '@/types/common/db.type'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export const dynamic = 'force-dynamic'

const ProductsServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams

  const sortBy = (
    typeof params.sortBy === 'string' && isValidProductsSortKey(params.sortBy)
      ? params.sortBy
      : 'title'
  ) as ProductsSortBy
  const order = (
    params.order === 'ASC' || params.order === 'DESC' ? params.order : 'DESC'
  ) as FindOptionsOrderValue

  try {
    const service = new ProductsService()
    const { products } = await service.getAll(sortBy, order)

    return <ProductsPage products={products as Product[]} />
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-destructive'>
            Failed to load products
          </h2>
          <p className='mt-2 text-muted-foreground'>
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    )
  }
}

export default ProductsServerPage
