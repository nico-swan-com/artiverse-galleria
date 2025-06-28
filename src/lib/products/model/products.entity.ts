import { encodeImageBufferToDataUrl } from '../../utilities'
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

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number

  @Column({ type: 'int' })
  stock!: number

  @Column({ type: 'bytea', nullable: true })
  @Transform(
    ({ value }) => {
      if (value === null) return undefined
      const buf = Buffer.from(value)
      return encodeImageBufferToDataUrl(buf)
    },
    { toPlainOnly: true }
  )
  image!: Buffer

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sales!: number

  @Column({ type: 'varchar', length: 50 })
  category!: string

  @Column({
    name: 'product_type',
    type: 'varchar',
    length: 50,
    default: 'physical'
  })
  productType!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string

  @Column({ name: 'artist_id', type: 'uuid', nullable: true })
  artistId?: string

  @Column({ type: 'text', array: true, nullable: true })
  images?: string[]

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

  @Column({ type: 'varchar', length: 50, nullable: true, default: 'Available' })
  availability?: string

  @Column({ type: 'boolean', default: false })
  featured!: boolean

  @CreateDateColumn({ name: 'created_at' })
  @Transform(({ value }) => (value === null ? undefined : value))
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at' })
  @Transform(({ value }) => (value === null ? undefined : value))
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
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
