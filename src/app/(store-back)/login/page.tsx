import LoginForm from '@/components/authentication/login-form.component'

const LoginPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-secondary/50 p-4'>
      <div className='w-full max-w-md animate-slide-up'>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
