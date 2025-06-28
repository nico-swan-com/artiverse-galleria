import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn
} from 'typeorm'
import bcrypt from 'bcryptjs'
import { UserRoles } from './user-roles.enum'
import { UserStatus } from './user-status.enum'
import { Exclude, instanceToPlain, Transform } from 'class-transformer'
import { encodeImageBufferToDataUrl } from '../../utilities'

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  email!: string

  @Column()
  name!: string

  @Column({ type: 'bytea', nullable: true })
  @Transform(
    ({ value }) => {
      if (value === null) return undefined
      const buf = Buffer.from(value)
      return encodeImageBufferToDataUrl(buf)
    },
    { toPlainOnly: true }
  )
  avatar?: Buffer

  @Exclude()
  @Column()
  password!: string

  @Column({ type: 'varchar', enum: UserRoles, default: 'Client' })
  role!: UserRoles

  @Column({ type: 'varchar', enum: UserStatus, default: 'Pending' })
  status!: UserStatus

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

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(password, salt)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  toPlain() {
    return instanceToPlain(this)
  }
}
