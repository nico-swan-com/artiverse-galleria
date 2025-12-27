import { PaginationParams } from '../../../types/common/pagination-params.type'
import { FindOptionsOrderValue } from '../../../types/common/db.type'
import { User, NewUser } from '../schema'
import { UsersResult } from '../../../types/users/users.type'
import { UsersSortBy } from '../../../types/users/users-sort-by.type'

/**
 * Users repository interface
 */
export interface IUsersRepository {
  getUsers(
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order?: FindOptionsOrderValue
  ): Promise<UsersResult>

  getUserById(id: string): Promise<Omit<User, 'password'> | null>

  getUserByEmail(email: string): Promise<User | null>

  create(user: NewUser): Promise<Omit<User, 'password'>>

  update(user: Partial<User> & { id: string }): Promise<void>

  delete(id: string): Promise<void>
}
