import { UsersRepository } from '@/lib/users'
import UsersPage from '@/components/admin/users/users-page.component'
import { unstable_cache } from 'next/cache'

const Users = async () => {
  const users = await getUsers()

  return <UsersPage users={users} />
}

const getUsers = unstable_cache(
  async () => {
    const repository = new UsersRepository()
    const users = await repository.getUsers()
    return users.map((user) => user.toPlain())
  },
  ['users'],
  {
    tags: ['users']
  }
)

export default Users
