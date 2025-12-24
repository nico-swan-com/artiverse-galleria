import { PaginationParams } from './../../types/common/pagination-params.type'
import {
  DeleteResult,
  FindOptionsOrderValue,
  UpdateResult
} from '../../types/common/db.type'
import { db } from '../database/drizzle'
import { users, type User, type NewUser } from '../database/schema'
import { eq, desc, asc, count } from 'drizzle-orm'
import { UsersResult } from '../../types/users/users.type'
import { UsersSortBy } from '../../types/users/users-sort-by.type'

class UsersRepository {
  async getUsers(
    pagination: PaginationParams,
    sortBy: UsersSortBy,
    order: FindOptionsOrderValue = 'DESC'
  ): Promise<UsersResult> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit
    const orderDir = order === 'DESC' ? desc : asc

    try {
      const data = await db.query.users.findMany({
        orderBy: [orderDir(users[sortBy])],
        limit: limit,
        offset: offset,
        columns: {
          password: false
        }
      })

      const rows = await db.select({ count: count() }).from(users)
      const total = rows[0].count

      return { users: data as unknown as any[], total }
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      const found = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          password: false
        }
      })
      return found as Omit<User, 'password'> | null
    } catch (error) {
      console.error('Error getting user by id:', error)
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // We might need password here for auth!
      // If this is used for login, we need password.
      // If used for profile check, we don't.
      // Usually getUserByEmail is for login.
      const found = await db.query.users.findFirst({
        where: eq(users.email, email)
      })
      return found as User | null
    } catch (error) {
      console.error('Error getting user by email:', error)
      throw error
    }
  }

  async create(user: NewUser): Promise<Omit<User, 'password'>> {
    try {
      const [created] = await db
        .insert(users)
        .values({
          ...user
        })
        .returning()

      const { password, ...safeUser } = created
      return safeUser
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async update(user: Partial<User> & { id: string }): Promise<UpdateResult> {
    try {
      await db
        .update(users)
        .set({
          ...user,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id))

      return { raw: [], affected: 1, generatedMaps: [] } as UpdateResult
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      await db.delete(users).where(eq(users.id, id))
      return { raw: [], affected: 1 } as DeleteResult
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}

const usersRepository = new UsersRepository()

export { UsersRepository, usersRepository }
