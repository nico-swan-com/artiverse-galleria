/* eslint-disable @typescript-eslint/no-explicit-any */
import { forbidden } from 'next/navigation'
import { NextRequest } from 'next/server'
import { auth } from './next-auth'

export function AuthGuard() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = async function (req: NextRequest, ...args: any[]) {
      const session = await auth()
      if (!session) {
        forbidden()
      }
      return await originalMethod.apply(this, [req, ...args])
    }

    return descriptor
  }
}
