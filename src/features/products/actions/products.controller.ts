import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from '@/types/common/db.type'

import ProductsService from '../lib/products.service'
import { ProductsSortBy } from '@/types/products/products-sort-by.type'
import { validateSearchQuery } from '@/lib/utilities/search-query.util'

export class ProductsController {
  private productsService: ProductsService

  constructor(productsService?: ProductsService) {
    this.productsService = productsService || new ProductsService()
  }

  async getProductsPublic(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'name') as ProductsSortBy
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '3', 10)
    const order = (searchParams.get('order') || 'DESC') as FindOptionsOrderValue
    const query = validateSearchQuery(searchParams.get('query'))

    const { products, total } = await this.productsService.getPaged(
      { page, limit },
      sortBy,
      order,
      { searchQuery: query }
    )

    const sanitizedProducts = products.map(
      (product: {
        createdAt?: Date
        updatedAt?: Date
        [key: string]: unknown
      }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, ...rest } = product
        return rest
      }
    )
    return NextResponse.json({
      products: sanitizedProducts,
      total
    })
  }
}
