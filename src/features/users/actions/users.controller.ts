import Users from '../lib/users.service'
import { NextRequest, NextResponse } from 'next/server'
import { FindOptionsOrderValue } from '@/types/common/db.type'

import { AuthGuard } from '@/lib/authentication/auth-guard-route.decorator'
import { UsersSortBy } from '@/types/users/users-sort-by.type'
import { PAGINATION } from '@/shared/constants/pagination.constants'

export class UsersController {
  @AuthGuard()
  async getUsers(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as UsersSortBy
    const page = parseInt(
      searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE),
      10
    )
    const limit = parseInt(
      searchParams.get('limit') || String(PAGINATION.DEFAULT_PAGE_SIZE),
      10
    )
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
