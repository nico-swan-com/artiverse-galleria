import { Media, NewMedia } from '../schema'

/**
 * Media repository interface
 */
export interface IMediaRepository {
  getAll(): Promise<Media[]>

  getById(id: string): Promise<Media | null>

  createAndSave(mediaData: NewMedia): Promise<Media>

  deleteById(id: string): Promise<boolean>

  findByContentHash(contentHash: string): Promise<Media | null>
}
