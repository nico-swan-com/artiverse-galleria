import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import { auth } from '@/features/authentication/lib'
import { redirect } from 'next/navigation'

const AdminPage = async () => {
  const session = await auth()

  if (!session) {
    return redirect('/login')
  }

  return (
    <div className='p-6'>
      <AnalyticsDashboard />
    </div>
  )
}

export default AdminPage
