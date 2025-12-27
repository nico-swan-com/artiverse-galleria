import { forbidden } from 'next/navigation'
import { NextRequest } from 'next/server'
import { auth } from './next-auth'

export function AuthGuard() {
  return function <
    T extends (req: NextRequest, ...args: unknown[]) => Promise<Response>
  >(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value!
    descriptor.value = async function (
      this: unknown,
      req: NextRequest,
      ...args: unknown[]
    ): Promise<Response> {
      const session = await auth()
      if (!session) {
        forbidden()
      }
      return await originalMethod.apply(this, [req, ...args])
    } as T

    return descriptor
  }
}
