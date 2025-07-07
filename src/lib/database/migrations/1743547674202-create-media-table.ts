import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateMediaTable1743547674202 implements MigrationInterface {
  name = 'CreateMediaTable1743547674202'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'media',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'fileName',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'mimeType',
            type: 'varchar',
            length: '50',
            isNullable: false
          },
          {
            name: 'fileSize',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'data',
            type: 'bytea',
            isNullable: false
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('media')
  }
}
