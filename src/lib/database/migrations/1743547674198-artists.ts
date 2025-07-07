import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Artists1743547674198 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'artists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'image',
            type: 'text',
            isNullable: false
          },
          {
            name: 'logo',
            type: 'text',
            isNullable: true
          },
          {
            name: 'featured',
            type: 'boolean',
            default: 'false'
          },
          {
            name: 'styles',
            type: 'text',
            isArray: true,
            default: "'{}'"
          },
          {
            name: 'biography',
            type: 'text'
          },
          {
            name: 'specialization',
            type: 'varchar'
          },
          {
            name: 'location',
            type: 'varchar'
          },
          {
            name: 'email',
            type: 'varchar'
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'exhibitions',
            type: 'text',
            isArray: true,
            default: "'{}'"
          },
          {
            name: 'statement',
            type: 'text'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('artists')
  }
}
