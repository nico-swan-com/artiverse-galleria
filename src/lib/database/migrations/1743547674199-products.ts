import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Products1743547674199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'description',
            type: 'text'
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2
          },
          {
            name: 'stock',
            type: 'int'
          },
          {
            name: 'image',
            type: 'text'
          },
          {
            name: 'sales',
            type: 'decimal',
            precision: 10,
            scale: 2
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50'
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
    await queryRunner.dropTable('products')
  }
}
