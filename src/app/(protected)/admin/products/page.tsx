import ProductsPage from '@/components/admin/products/ProductsPage'
import { isValidProductsSortKey, Product, ProductsSortBy } from '@/lib/products'
import ProductsService from '@/lib/products/products.service'
import { instanceToPlain } from 'class-transformer'
import { FindOptionsOrderValue } from 'typeorm'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const ProductsServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams

  const sortBy = (
    typeof params.sortBy === 'string' && isValidProductsSortKey(params.sortBy)
      ? params.sortBy
      : 'name'
  ) as ProductsSortBy
  const order = (
    params.order === 'ASC' || params.order === 'DESC' ? params.order : 'DESC'
  ) as FindOptionsOrderValue
  const service = new ProductsService()
  const { products } = await service.getAll(sortBy, order)

  console.log('products', products)

  return <ProductsPage products={instanceToPlain(products) as Product[]} />
}

export default ProductsServerPage
