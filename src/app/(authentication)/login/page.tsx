import LoginForm from '@/components/authentication/login-form.component'
import { auth } from '@/lib/authentication'
import { redirect } from 'next/navigation'

type Params = Promise<{ callbackUrl: string }>
type SearchParams = Promise<{ callbackUrl: string }>

const LoginPage = async (props: {
  params: Params
  searchParams: SearchParams
}) => {
  const { callbackUrl } = await props.searchParams
  const session = await auth()
  if (session) {
    redirect(callbackUrl || '/')
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-secondary/50 p-4'>
      <div className='w-full max-w-md animate-slide-up'>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  )
}

export default LoginPage
