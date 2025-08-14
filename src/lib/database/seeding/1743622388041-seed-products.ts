import { MigrationInterface, QueryRunner } from 'typeorm'
import { artworks as productData } from '../data/artworks'

export class SeedProducts1743622388041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      // Helper to SQL-escape single quotes
      const esc = (val: string) => val.replace(/'/g, "''")
      // Helper to format arrays for Postgres
      const arr = (a?: string[]) =>
        a && a.length
          ? `'{${a.map((s) => '"' + esc(s) + '"').join(',')}}'`
          : 'NULL'
      // Helper to format dates
      const dt = (d?: Date) => (d ? `'${d.toISOString()}'` : 'NOW()')
      await queryRunner.query(`
        INSERT INTO products (
          id, sku, title, description, price, stock, feature_image, images, sales, featured, product_type, category, artist_id, year_created, medium, dimensions, weight, style, created_at, updated_at
        ) VALUES
        ${productData
          .map(
            (p, i) => `(
            '${p.id}',
            ${i + 1},
            '${esc(p.title)}',
            '${esc(p.description)}',
            ${p.price},
            ${p.stock},
            ${p.featureImage ? `'${esc(p.featureImage as string)}'` : 'NULL'},
            ${arr(p.images as string[])},
            ${p.sales},
            ${p.featured ? 'TRUE' : 'FALSE'},
            '${esc(p.productType)}',
            '${esc(p.category)}',
            ${p.artistId ? `'${p.artistId}'` : 'NULL'},
            ${p.yearCreated ?? 'NULL'},
            ${p.medium ? `'${esc(p.medium)}'` : 'NULL'},
            ${p.dimensions ? `'${esc(p.dimensions)}'` : 'NULL'},
            ${p.weight ? `'${esc(p.weight)}'` : 'NULL'},
            ${p.style ? `'${esc(p.style)}'` : 'NULL'},
            ${dt(p.createdAt)},
            ${dt(p.updatedAt)}
          )`
          )
          .join(',\n')}
      `)
      console.log('Products seeded successfully!')
    } catch (error) {
      console.error('Error seeding products:', error)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `DELETE FROM products WHERE id IN (${productData.map((p) => `'${p.id}'`).join(',')})`
      )
      console.log('Seeded products removed successfully!')
    } catch (error) {
      console.error('Error removing seeded products:', error)
    }
  }
}
