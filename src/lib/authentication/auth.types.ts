import { auth } from './next-auth'

export type AuthSession = Awaited<ReturnType<typeof auth>>

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}
