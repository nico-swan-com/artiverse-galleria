import { AuthGuard } from '@/lib/authentication/auth-guard-route.decorator'
import Users from './users.service'

export class UsersController {
  @AuthGuard()
  async getUsers(): Promise<Response> {
    const users = new Users()
    const allUsers = await users.getAllUsers()
    return new Response(JSON.stringify(allUsers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // async POST(request: Request) {
  //   // Parse the request body
  //   const body = await request.json()
  //   const { name } = body

  //   // e.g. Insert new user into your DB
  //   const newUser = { id: Date.now(), name }

  //   return new Response(JSON.stringify(newUser), {
  //     status: 201,
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  // }
}
