import { ArtistsEntity } from './../../artists/model/artist.entity'

import { MigrationInterface, QueryRunner } from 'typeorm'
import { artists as artistData } from '../data/artists'

export class SeedArtists1743622388040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const artistRepository = queryRunner.manager.getRepository(ArtistsEntity)
    const newArtists = artistData.map((artist) => ({
      id: artist.id, // Ensure the UUID is set explicitly
      name: artist.name,
      image: artist.image,
      featured: artist.featured,
      styles: artist.styles,
      biography: artist.biography,
      specialization: artist.specialization,
      location: artist.location,
      email: artist.email,
      website: artist.website,
      exhibitions: artist.exhibitions,
      statement: artist.statement
    }))

    try {
      await artistRepository.insert(newArtists)
      console.log('Artists seeded successfully!')
    } catch (error) {
      console.error('Error seeding artists:', error)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const artistRepository = queryRunner.manager.getRepository(ArtistsEntity)
    const artistIds = artistData.map((artist) => artist.id)

    try {
      await artistRepository.delete(artistIds)
      console.log('Seeded artists removed successfully!')
    } catch (error) {
      console.error('Error removing seeded artists:', error)
    }
  }
}
