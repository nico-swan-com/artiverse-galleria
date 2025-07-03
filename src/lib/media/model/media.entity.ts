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

  @Column({ length: 255 })
  fileName!: string

  @Column({ length: 50 })
  mimeType!: string

  @Column('integer')
  fileSize!: number

  @Column('bytea')
  data!: Buffer

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
