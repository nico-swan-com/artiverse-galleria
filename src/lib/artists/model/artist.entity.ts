import { instanceToPlain, Transform } from 'class-transformer'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column()
  photoUrl!: string

  @Column({ default: false })
  featured!: boolean

  @Column('text', { array: true, default: [] })
  styles!: string[]

  @Column({ type: 'text' })
  biography!: string

  @Column()
  specialization!: string

  @Column()
  location!: string

  @Column()
  email!: string

  @Column({ nullable: true })
  @Transform(({ value }) => (value === null ? undefined : value))
  website?: string

  @Column('text', { array: true, default: [] })
  exhibitions!: string[]

  @Column({ type: 'text' })
  statement!: string

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
  @Transform(({ value }) => (!!value ? value.toISOString() : undefined), {
    toPlainOnly: true
  })
  deletedAt?: Date

  toPlain() {
    return instanceToPlain(this).toPlainOnly()
  }
}
