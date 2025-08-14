import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm'

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
            name: 'sku',
            type: 'int',
            isUnique: true,
            isGenerated: true,
            generationStrategy: 'increment'
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
            name: 'feature_image',
            type: 'text',
            isNullable: true
          },
          {
            name: 'images',
            type: 'text[]',
            isNullable: true
          },
          {
            name: 'sales',
            type: 'decimal',
            precision: 10,
            scale: 2
          },
          {
            name: 'featured',
            type: 'boolean',
            default: false
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
            name: 'artist_id',
            type: 'uuid',
            isNullable: true
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
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_product_artist',
        columnNames: ['artist_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'artists',
        onDelete: 'SET NULL'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('products', 'FK_product_artist')
    await queryRunner.dropTable('products')
  }
}
