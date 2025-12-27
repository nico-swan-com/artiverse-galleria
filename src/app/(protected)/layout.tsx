import { auth } from '@/features/authentication/lib/next-auth'
import { redirect } from 'next/navigation'
import { UserRoles } from '@/types/users/user-roles.enum'
import PlatformLayout from '@/components/layout/PlatformLayout'
import ClientLayout from '@/components/layout/ClientLayout'

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const role = session.user.role as UserRoles

  // Client and Artist get the ClientLayout
  if (role === UserRoles.Client || role === UserRoles.Artist) {
    return <ClientLayout>{children}</ClientLayout>
  }

  // Everyone else (Admin, Editor, ShopManager, ShopAdmin) gets the PlatformLayout
  return <PlatformLayout>{children}</PlatformLayout>
}
