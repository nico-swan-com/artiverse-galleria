/**
 * User Domain Schema
 *
 * Re-exports from the types directory for backwards compatibility.
 * In future refactoring, move the actual schema definitions here.
 */
export {
  PasswordSchema,
  UpdatePasswordSchema,
  UserSchema,
  UserListSchema,
  UserCreateSchema,
  UserUpdateSchema,
  UserUpdatePartialSchema,
  UserUpdateListSchema,
  UserUpdateListPartialSchema,
  type User,
  type UserList,
  type UserCreate,
  type UserUpdate,
  type UserUpdatePartial,
  type UserUpdateList,
  type UserUpdateListPartial
} from '@/types/users/user.schema'
