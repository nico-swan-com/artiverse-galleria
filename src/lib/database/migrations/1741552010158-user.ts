import { UserRoles } from '@/lib/data-access/users/user-roles.enum'
import { UserStatus } from '@/lib/data-access/users/user-status.enum'
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class User1741552010158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'role',
        type: 'varchar',
        isNullable: false
      }),
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false
      }),
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP'
      })
    ])
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', ['role', 'status', 'createdAt'])
  }
}
