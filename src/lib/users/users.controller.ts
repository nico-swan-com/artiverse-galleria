import { AuthGuard } from '@/lib/authentication/auth-guard-route.decorator'
import Users from './users.service'
import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/types/common/user'
import { FindOptionsOrderValue } from 'typeorm'

export class UsersController {
  @AuthGuard()
  async getUsers(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as keyof User
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const order = (searchParams.get('order') || 'DESC') as FindOptionsOrderValue

    const usersService = new Users()
    const { users, total } = await usersService.getUsers(
      { page, limit },
      sortBy,
      order
    )

    return NextResponse.json({ users, total })
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
