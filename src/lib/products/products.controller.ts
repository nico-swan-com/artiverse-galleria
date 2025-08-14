import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from 'typeorm'

import ProductsService from './products.service'
import { ProductsSortBy } from './model/products-sort-by.type'

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
    const query = searchParams.get('query')

    const { products, total } = await this.productsService.getPaged(
      { page, limit },
      sortBy,
      order,
      query || undefined
    )

    const sanitizedProducts = products.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ createdAt, updatedAt, ...rest }) => rest
    )
    return NextResponse.json({
      products: sanitizedProducts,
      total
    })
  }
}
