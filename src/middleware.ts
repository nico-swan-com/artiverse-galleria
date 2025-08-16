import { auth } from '@/lib/authentication'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin)
    newUrl.searchParams.set(`callbackUrl`, `${req.nextUrl}`)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/admin', '/admin/(.*)', '/api/admin/(.*)'],
  runtime: 'nodejs'
}
