import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddTagsToMedia1743622388043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('media', new TableColumn())
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('media', 'tags')
  }
}
