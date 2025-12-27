import ProductsService from '@/features/products/lib/products.service'
import ArtworksClient from './ArtworksClient'

export const dynamic = 'force-dynamic'

export default async function ArtworksPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  try {
    const page = Number(searchParams.page) || 1
    const limit = 9

    const filters = {
      searchQuery: (searchParams.searchQuery as string) || undefined,
      category: (searchParams.category as string) || undefined,
      style: (searchParams.style as string) || undefined,
      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined
    }

    const productService = new ProductsService()

    // Fetch data in parallel
    const [productsData, categories, styles] = await Promise.all([
      productService.getPaged({ page, limit }, 'createdAt', 'DESC', filters),
      productService.getCategories(),
      productService.getStyles()
    ])

    const totalPages = Math.ceil(productsData.total / limit)

    // Pass to a client component for filtering/searching
    return (
      <ArtworksClient
        artworks={productsData.products}
        categories={categories}
        styles={styles}
        total={productsData.total}
        totalPages={totalPages}
        currentPage={page}
      />
    )
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>
            Error Loading Artworks
          </h2>
          <p className='text-gray-600'>
            Unable to load artworks at this time. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
