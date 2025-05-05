/* eslint-disable @typescript-eslint/no-explicit-any */
import { forbidden } from 'next/navigation'
import { NextApiRequest } from 'next'
import { auth } from './next-auth'

/**
 * Decorator that restricts access to a Next.js API route handler to authenticated users only.
 *
 * When applied to a method, this decorator checks for a valid authentication session before allowing the method to execute. If no session is found, the request is blocked with a forbidden response.
 *
 * @remark Intended for use with Next.js API route handlers to enforce authentication.
 */
export function AuthGuard() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = async function (req: NextApiRequest, ...args: any[]) {
      const session = await auth()
      if (!session) {
        forbidden()
      }
      return await originalMethod.apply(this, [req, ...args])
    }

    return descriptor
  }
}
