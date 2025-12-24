import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Initial migration that creates the 'app' schema and database.
 * This serves as the foundation for subsequent migrations that will create
 * tables for users, artists, and other entities.
 */
export class Initial1741552010156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createDatabase('artiverse', true)
      await queryRunner.createSchema('artiverse', true)
    } catch (error) {
      console.warn('Schema or database might already exist:', error)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('artiverse')
    await queryRunner.dropSchema('artiverse')
  }
}
