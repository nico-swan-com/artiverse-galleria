import UsersPage from '@/components/admin/users/UsersPage'
import {
  isValidUsersSortKey,
  UsersSortBy
} from '@/types/users/users-sort-by.type'
import { getUsersUnstableCache } from '@/lib/users/users.actions'
import { FindOptionsOrderValue } from '@/types/common/db.type'
import { auth } from '@/lib/authentication/next-auth'
import { UserRoles } from '@/types/users/user-roles.enum'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const UsersServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams
  const session = await auth()
  const currentUserRole = (session?.user?.role as UserRoles) || UserRoles.Client

  const sortBy = (
    typeof params.sortBy === 'string' && isValidUsersSortKey(params.sortBy)
      ? params.sortBy
      : 'createdAt'
  ) as UsersSortBy
  const page = Math.max(1, parseInt((params.page as string) || '1', 10) || 1)
  const limit = Math.min(50, Math.max(1, Number(params.limit || 5) || 5))
  const order = (
    params.order === 'ASC' || params.order === 'DESC' ? params.order : 'DESC'
  ) as FindOptionsOrderValue

  const { users, total } = await getUsersUnstableCache(
    { page, limit },
    sortBy,
    order
  )

  return (
    <UsersPage
      users={users || []}
      page={page}
      limit={limit}
      total={total}
      sortBy={sortBy}
      order={order}
      currentUserRole={currentUserRole}
    />
  )
}

export default UsersServerPage
