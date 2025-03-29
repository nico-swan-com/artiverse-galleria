import Dashboard from '@/components/admin/dashboard.component'
import { auth } from '@/lib/authentication'
import { redirect } from 'next/navigation'

const AdminPage = async () => {
  const session = await auth()

  if (!session) {
    return redirect('/login')
  }

  return <Dashboard />
}

export default AdminPage
