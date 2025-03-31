import UsersPage from '@/components/admin/users/users-page.component'
import { getUsersUnstableCache } from '@/lib/users/users.service'
import { User } from '@/types'
import { FindOptionsOrderValue } from 'typeorm'

//type Params = Promise<{ callbackUrl: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const UsersServerPage = async (props: { searchParams: SearchParams }) => {
  const params = await props.searchParams

  const sortBy = (params.sortBy || 'createdAt') as keyof User
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const limit = Number(params.limit || 5)
  const order = (params.order || 'DESC') as FindOptionsOrderValue

  const { users, total } = await getUsersUnstableCache(
    { page, limit },
    sortBy,
    order
  )

  return (
    <UsersPage
      users={users}
      page={page}
      limit={limit}
      total={total}
      sortBy={sortBy}
      order={order}
    />
  )
}

export default UsersServerPage
