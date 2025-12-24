'use server'

import { auth } from './next-auth'
import { AuthorizationError } from './auth.types'
import { UserRoles } from '@/types/users/user-roles.enum'

/**
 * Require authentication and optionally check role-based permissions.
 * Use this in server actions to protect mutations.
 *
 * @param allowedRoles - Optional array of roles that are permitted to perform this action
 * @returns The authenticated session
 * @throws AuthorizationError if not authenticated or lacking permissions
 */
export async function requireAuth(allowedRoles?: UserRoles[]) {
  const session = await auth()

  if (!session?.user) {
    throw new AuthorizationError('Unauthorized: You must be logged in')
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.role as UserRoles
    if (!allowedRoles.includes(userRole)) {
      throw new AuthorizationError(
        'Forbidden: You do not have permission to perform this action'
      )
    }
  }

  return session
}

/**
 * Check if the current user can edit the specified resource.
 * Admins can edit any resource, others can only edit their own.
 *
 * @param resourceOwnerId - The ID of the resource owner
 * @param adminRoles - Roles that can edit any resource (default: Admin, Editor)
 * @returns The authenticated session
 * @throws AuthorizationError if not permitted
 */
export async function requireAuthOrSelf(
  resourceOwnerId: string,
  adminRoles: UserRoles[] = [UserRoles.Admin, UserRoles.Editor]
) {
  const session = await auth()

  if (!session?.user) {
    throw new AuthorizationError('Unauthorized: You must be logged in')
  }

  const userRole = session.user.role as UserRoles
  const isAdmin = adminRoles.includes(userRole)
  const isSelf = session.user.id === resourceOwnerId

  if (!isAdmin && !isSelf) {
    throw new AuthorizationError(
      'Forbidden: You can only edit your own resources'
    )
  }

  return session
}
