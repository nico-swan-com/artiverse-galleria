import { auth } from '@/lib/authentication'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin)
    newUrl.searchParams.set(`callbackUrl`, `${req.nextUrl}`)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/dashboard', '/api/admin'],
  runtime: 'nodejs'
}

// export default async function middleware(req: NextRequest) {
//   // Get the pathname of the request (e.g. /, /protected)
//   const path = req.nextUrl.pathname

//   // If it's the root path, just render it
//   if (path === '/') {
//     return NextResponse.next()
//   }

//   const session = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET
//   })

//   const isProtected = path.includes('/dashboard')

//   if (!session && isProtected) {
//     return NextResponse.redirect(new URL('/restore', req.url))
//   } else if (session && (path === '/restore' || path === '/register')) {
//     return NextResponse.redirect(new URL('/dashboard', req.url))
//   }
//   return NextResponse.next()
// }
