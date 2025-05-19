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

  @Column({ type: 'text' })
  image!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sales!: number

  @Column({ type: 'varchar', length: 50 })
  category!: string

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
