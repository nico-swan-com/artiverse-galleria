import NextAuth from 'next-auth'
import { authConfig } from '@/lib/authentication/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin)
    newUrl.searchParams.set(`callbackUrl`, `${req.nextUrl}`)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/admin', '/admin/(.*)', '/api/admin/(.*)']
}
