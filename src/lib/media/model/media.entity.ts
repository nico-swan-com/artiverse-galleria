import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

/**
 * Media entity for storing image blobs and metadata.
 */
@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'file_name', length: 255 })
  fileName!: string

  @Column({ name: 'mime_type', length: 50 })
  mimeType!: string

  @Column({ name: 'file_size', type: 'integer' })
  fileSize!: number

  @Column('bytea')
  data!: Buffer

  @Column({ name: 'alt_text', length: 255 })
  altText?: string

  @Column({
    name: 'content_hash',
    type: 'varchar',
    length: 64,
    unique: false,
    nullable: true
  })
  contentHash?: string

  @Column({
    name: 'tags',
    type: 'text',
    array: true,
    nullable: true,
    default: () => 'ARRAY[]::text[]'
  })
  tags?: string[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date
}
