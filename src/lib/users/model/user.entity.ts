import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import bcrypt from 'bcryptjs'
import { UserRoles } from './user-roles.enum'
import { UserStatus } from './user-status.enum'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  email!: string

  @Column()
  name!: string

  @Column()
  avatar!: string

  @Column()
  password!: string

  @Column({ type: 'varchar', enum: UserRoles, default: 'Client' })
  role!: UserRoles

  @Column({ type: 'varchar', enum: UserStatus, default: 'Pending' })
  status!: UserStatus

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(password, salt)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  toPlain() {
    const json = JSON.parse(JSON.stringify(this))
    return { ...json }
  }
}
