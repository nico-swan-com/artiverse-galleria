import { MediaService } from './media.service'
import { MediaRepository } from './media.repository'
import { MediaCreate } from '../types/media.schema'
import { type Media } from '@/lib/database/schema'

jest.mock('@/features/products/actions/products.controller', () => ({}))
jest.mock('@/features/products', () => ({}))
jest.mock('@/lib/database/drizzle', () => ({
  db: {}
}))

jest.mock('./media.repository')

const mockRepo = new MediaRepository() as jest.Mocked<MediaRepository>
const service = new MediaService()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(service as any).mediaRepository = mockRepo

describe('MediaService.uploadImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calculates SHA-256 hash and saves media', async () => {
    mockRepo.findByContentHash.mockResolvedValue(null)
    mockRepo.createAndSave.mockImplementation(async (media) => media as Media)
    const fileData = Buffer.from('test file')
    const file: MediaCreate = {
      fileName: 'test.png',
      mimeType: 'image/png',
      fileSize: fileData.length,
      data: fileData
    }
    const result = await service.uploadImage(file)
    expect(result.contentHash).toHaveLength(64)
    expect(mockRepo.createAndSave).toHaveBeenCalled()
  })

  it('returns existing file for duplicate files', async () => {
    const existingMedia = {
      id: '1'
    } as unknown as Media
    mockRepo.findByContentHash.mockResolvedValue(existingMedia)
    const fileData = Buffer.from('duplicate')
    const file: MediaCreate = {
      fileName: 'dup.png',
      mimeType: 'image/png',
      fileSize: fileData.length,
      data: fileData
    }
    const result = await service.uploadImage(file)
    expect(result).toEqual(existingMedia)
  })

  it('rejects files over 5MB', async () => {
    mockRepo.findByContentHash.mockResolvedValue(null)
    const fileData = Buffer.alloc(5 * 1024 * 1024 + 1)
    const file: MediaCreate = {
      fileName: 'big.png',
      mimeType: 'image/png',
      fileSize: fileData.length,
      data: fileData
    }
    await expect(service.uploadImage(file)).rejects.toThrow('File is too large')
  })

  it('throws on invalid file data', async () => {
    await expect(
      service.uploadImage({} as unknown as MediaCreate)
    ).rejects.toThrow('Invalid media file data')
  })
})
