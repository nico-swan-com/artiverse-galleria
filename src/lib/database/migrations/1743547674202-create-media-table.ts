import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

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
            name: 'file_name',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '50',
            isNullable: false
          },
          {
            name: 'file_size',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'data',
            type: 'bytea',
            isNullable: false
          },
          {
            name: 'content_hash',
            type: 'varchar',
            length: '64',
            isNullable: true
          },
          {
            name: 'alt_text',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'tags',
            type: 'text',
            isArray: true,
            isNullable: true,
            default: 'ARRAY[]::text[]'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false
          }
        ]
      })
    )
    await queryRunner.createIndices('media', [
      new TableIndex({
        name: 'idx_media_file_name',
        columnNames: ['file_name']
      }),
      new TableIndex({
        name: 'idx_media_content_hash',
        columnNames: ['content_hash']
      })
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('media', 'idx_media_content_hash')
    await queryRunner.dropTable('media')
  }
}
