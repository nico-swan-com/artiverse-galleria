import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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

  @Column()
  website?: string

  @Column('text', { array: true, default: [] })
  exhibitions!: string[]

  @Column({ type: 'text' })
  statement!: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date
}
