import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class ProductsArtworkFields1743547674200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('products', [
      new TableColumn({
        name: 'product_type',
        type: 'varchar',
        length: '50',
        default: "'physical'",
        isNullable: false
      }),
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '255',
        isNullable: true
      }),
      new TableColumn({
        name: 'artist_id',
        type: 'uuid',
        isNullable: true
      }),
      new TableColumn({
        name: 'images',
        type: 'text[]',
        isNullable: true
      }),
      new TableColumn({
        name: 'year_created',
        type: 'int',
        isNullable: true
      }),
      new TableColumn({
        name: 'medium',
        type: 'varchar',
        length: '100',
        isNullable: true
      }),
      new TableColumn({
        name: 'dimensions',
        type: 'varchar',
        length: '100',
        isNullable: true
      }),
      new TableColumn({
        name: 'weight',
        type: 'varchar',
        length: '50',
        isNullable: true
      }),
      new TableColumn({
        name: 'style',
        type: 'varchar',
        length: '50',
        isNullable: true
      }),
      new TableColumn({
        name: 'availability',
        type: 'varchar',
        length: '50',
        isNullable: true,
        default: "'Available'"
      }),
      new TableColumn({
        name: 'featured',
        type: 'boolean',
        default: false
      })
    ])

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
    await queryRunner.dropColumns('products', [
      'product_type',
      'title',
      'artist_id',
      'images',
      'year_created',
      'medium',
      'dimensions',
      'weight',
      'style',
      'availability',
      'featured'
    ])

    // Drop the product_type enum
    await queryRunner.query(`DROP TYPE IF EXISTS product_type;`)
  }
}
