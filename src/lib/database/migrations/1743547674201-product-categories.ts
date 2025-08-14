import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class ProductCategories1743547674201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'product_categories',
      new TableIndex({
        name: 'IDX_product_categories_name',
        columnNames: ['name']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'product_categories',
      'IDX_product_categories_name'
    )
    await queryRunner.dropTable('product_categories')
  }
}
