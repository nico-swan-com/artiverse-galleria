import { MigrationInterface, QueryRunner } from 'typeorm'

const productData = [
  {
    name: 'Premium Headphones',
    description:
      'Wireless noise-cancelling headphones with exceptional sound quality.',
    price: 299.99,
    stock: 45,
    image: null,
    sales: 128,
    category: 'Electronics',
    created_at: '2023-06-12'
  },
  {
    name: 'Smart Watch',
    description: 'Health and fitness tracking with smart notifications.',
    price: 199.99,
    stock: 32,
    image: null,
    sales: 97,
    category: 'Electronics',
    created_at: '2023-07-23'
  },
  {
    name: 'Laptop Backpack',
    description:
      'Water-resistant backpack with multiple compartments and USB charging port.',
    price: 79.99,
    stock: 58,
    image: null,
    sales: 83,
    category: 'Accessories',
    created_at: '2023-08-04'
  },
  {
    name: 'Wireless Keyboard',
    description: 'Ergonomic keyboard with customizable RGB lighting.',
    price: 129.99,
    stock: 21,
    image: null,
    sales: 65,
    category: 'Electronics',
    created_at: '2023-09-15'
  },
  {
    name: 'Phone Stand',
    description: 'Adjustable aluminum stand for smartphones and tablets.',
    price: 24.99,
    stock: 76,
    image: null,
    sales: 52,
    category: 'Accessories',
    created_at: '2023-10-26'
  },
  {
    name: 'Wireless Earbuds',
    description:
      'True wireless earbuds with long battery life and water resistance.',
    price: 149.99,
    stock: 38,
    image: null,
    sales: 114,
    category: 'Electronics',
    created_at: '2023-11-07'
  },
  {
    name: 'Desk Lamp',
    description:
      'Modern LED desk lamp with adjustable brightness and color temperature.',
    price: 49.99,
    stock: 64,
    image: null,
    sales: 41,
    category: 'Home',
    created_at: '2023-12-18'
  },
  {
    name: 'Portable SSD',
    description: 'Fast and compact external solid-state drive.',
    price: 179.99,
    stock: 27,
    image: null,
    sales: 77,
    category: 'Electronics',
    created_at: '2024-01-29'
  }
]

export class SeedProducts1743547674200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        INSERT INTO products (
          name, description, price, stock, image, sales, category, created_at
        ) VALUES
        ${productData
          .map(
            (p) => `(
              '${p.name}',
              '${p.description}',
              ${p.price},
              ${p.stock},
              '${p.image}',
              ${p.sales},
              '${p.category}',
              '${p.created_at}'
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
        `DELETE FROM products WHERE created_at IN (${productData.map((p) => `'${p.created_at}'`).join(',')})`
      )
      console.log('Seeded products removed successfully!')
    } catch (error) {
      console.error('Error removing seeded products:', error)
    }
  }
}
