import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class ProductVariations1743547674200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_variations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()'
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'variation_id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()'
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '50',
            isUnique: true
          },
          {
            name: 'title',
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
            name: 'sales',
            type: 'decimal',
            precision: 10,
            scale: 2
          },
          {
            name: 'product_type',
            type: 'varchar',
            length: '50',
            default: "'physical'",
            isNullable: false
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50'
          },
          {
            name: 'year_created',
            type: 'int',
            isNullable: true
          },
          {
            name: 'medium',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'dimensions',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'weight',
            type: 'varchar',
            length: '50',
            isNullable: true
          },
          {
            name: 'style',
            type: 'varchar',
            length: '50',
            isNullable: true
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
    await queryRunner.dropTable('product_variations')
  }
}
