import { MediaEntity } from '../../media/model/media.entity'

import { MigrationInterface, QueryRunner } from 'typeorm'
import mediaData from '../data/media'

export class SeedMedia1743622388038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mediaRepository = queryRunner.manager.getRepository(MediaEntity)
    const newMedia = mediaData.map((media) => ({
      id: media.id,
      fileName: media.fileName,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      data: Buffer.from(media.data, 'base64'),
      createdAt: media.createdAt ? new Date(media.createdAt) : new Date(),
      updatedAt: media.updatedAt ? new Date(media.updatedAt) : new Date()
    }))

    try {
      await mediaRepository.insert(newMedia)
      console.log('Media seeded successfully!')
    } catch (error) {
      console.error('Error seeding media:', error)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const mediaRepository = queryRunner.manager.getRepository(MediaEntity)
    const ids = mediaData.map((media) => media.id)

    try {
      await mediaRepository.delete(ids)
      console.log('Seeded artists removed successfully!')
    } catch (error) {
      console.error('Error removing seeded artists:', error)
    }
  }
}
