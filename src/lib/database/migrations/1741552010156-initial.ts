import { MigrationInterface, QueryRunner } from 'typeorm'

export class User1741552010157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('app')
    await queryRunner.createDatabase('app')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('app')
    await queryRunner.dropSchema('app')
  }
}
