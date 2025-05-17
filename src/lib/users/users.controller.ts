import Users from './users.service'
import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from 'typeorm'

import { AuthGuard } from '../authentication/auth-guard-route.decorator'
import { UsersSortBy } from './model'

export class UsersController {
  @AuthGuard()
  async getUsers(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as UsersSortBy
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
}
