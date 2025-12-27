import { notFound } from 'next/navigation'
import UserForm from '@/features/users/components/admin/UserForm'
import { getUserByIdUnstableCache } from '@/features/users/actions/users.actions'
import { UserStatus } from '@/types/users/user-status.enum'
import { UserRoles } from '@/types/users/user-roles.enum'
import { User as SchemaUser } from '@/types/users/user.schema'

interface EditUserPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params

  try {
    const dbUser = await getUserByIdUnstableCache(id)

    if (!dbUser) {
      notFound()
    }

    // Map database user to schema user with proper enum types
    const user: SchemaUser = {
      ...dbUser,
      status: dbUser.status as UserStatus,
      role: dbUser.role as UserRoles,
      avatar: dbUser.avatar ?? undefined,
      deletedAt: dbUser.deletedAt ?? undefined
    }

    return <UserForm initialUser={user} isEdit />
  } catch (error) {
    console.error('Error loading user:', error)
    notFound()
  }
}
