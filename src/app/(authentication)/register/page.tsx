import RegisterForm from '@/features/authentication/components/RegisterForm'
import { auth } from '@/features/authentication/lib/next-auth'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | Artiverse Galleria',
  description: 'Create a new account'
}

const RegisterPage = async () => {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-secondary/50 p-4'>
      <div className='w-full max-w-md animate-slide-up'>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
