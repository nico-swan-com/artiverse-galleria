import { instanceToPlain, Transform } from 'class-transformer'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'int', unique: true, generated: 'increment' })
  sku!: number

  @Column({ type: 'varchar', length: 255 })
  title!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number

  @Column({ type: 'int' })
  stock!: number

  @Column({ name: 'feature_image', type: 'text', nullable: true })
  featureImage?: string

  @Column({ type: 'text', array: true, nullable: true })
  images?: string[]

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sales!: number

  @Column({ type: 'boolean', default: false })
  featured!: boolean

  @Column({
    name: 'product_type',
    type: 'varchar',
    length: 50,
    default: 'physical'
  })
  productType!: string

  @Column({ type: 'varchar', length: 50 })
  category!: string

  @Column({ name: 'artist_id', type: 'uuid', nullable: true })
  artistId?: string

  @Column({ name: 'year_created', type: 'int', nullable: true })
  yearCreated?: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  medium?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  dimensions?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  weight?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  style?: string

  @CreateDateColumn({ name: 'created_at' })
  @Transform(({ value }) => (value === null ? undefined : value))
  @Transform(({ value }) => (value ? value.toISOString() : undefined), {
    toPlainOnly: true
  })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at' })
  @Transform(({ value }) => (value === null ? undefined : value))
  @Transform(({ value }) => (value ? value.toISOString() : undefined), {
    toPlainOnly: true
  })
  updatedAt?: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  @Transform(({ value }) => (value === null ? undefined : value))
  @Transform(({ value }) => (value ? value.toISOString() : undefined), {
    toPlainOnly: true
  })
  deletedAt?: Date

  toPlain() {
    return instanceToPlain(this)
  }
}
