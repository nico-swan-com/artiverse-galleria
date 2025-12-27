import { createProduct, updateProduct, deleteProduct } from './products.actions'
import ProductsService from '../lib/products.service'
import type {
  ProductCreate,
  ProductUpdate
} from '@/types/products/product.schema'

// Mock dependencies of the Service to ensure safe instantiation
jest.mock('../lib/products.repository')
// Mock low level DB/Cache just in case
jest.mock('@/lib/database/drizzle', () => ({
  db: {}
}))
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: (fn: () => unknown) => fn
}))
jest.mock('@/lib/utilities/logger', () => ({
  logger: { error: jest.fn() }
}))

describe('Products Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createProduct', () => {
    it('should create product and revalidate', async () => {
      const input = { title: 'P1' }
      const output = { id: '1', ...input }

      // Spy on the prototype method
      const createSpy = jest
        .spyOn(ProductsService.prototype, 'create')
        .mockResolvedValue(output)

      const result = await createProduct(input as ProductCreate)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(output)
      expect(createSpy).toHaveBeenCalledWith(input)
    })

    it('should handle errors', async () => {
      jest
        .spyOn(ProductsService.prototype, 'create')
        .mockRejectedValue(new Error('Fail'))

      const result = await createProduct({} as ProductCreate)
      expect(result.success).toBe(false)
    })
  })

  describe('updateProduct', () => {
    it('should update product and revalidate', async () => {
      const input = { id: '1', title: 'P1' }
      const updateSpy = jest
        .spyOn(ProductsService.prototype, 'update')
        .mockResolvedValue(undefined)

      const result = await updateProduct(input as ProductUpdate)

      expect(result.success).toBe(true)
      expect(updateSpy).toHaveBeenCalledWith(input)
    })
  })

  describe('deleteProduct', () => {
    it('should delete product and revalidate', async () => {
      const deleteSpy = jest
        .spyOn(ProductsService.prototype, 'delete')
        .mockResolvedValue(undefined)

      const result = await deleteProduct('1')

      expect(result.success).toBe(true)
      expect(deleteSpy).toHaveBeenCalledWith('1')
    })
  })
})
