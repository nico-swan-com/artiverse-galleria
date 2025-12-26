import NextAuth, { CredentialsSignin } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import bcrypt from 'bcryptjs'

import { getAvatarUrl } from '../utilities'
import { UsersRepository } from '../users'

import { env } from '../config/env.config'
import { logger } from '../utilities/logger'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin('Missing credentials')
        }
        try {
          const users = new UsersRepository()

          const email: string = credentials.email as string
          const password: string = credentials.password as string

          const user = await users.getUserByEmail(email)

          if (!user) {
            throw new CredentialsSignin('Invalid credentials')
          }

          // Manually validate password since Drizzle object doesn't have methods
          const passwordMatch = await bcrypt.compare(password, user.password)
          const image = user.avatar || getAvatarUrl(user.email, user.name)

          if (passwordMatch) {
            return {
              email: user.email,
              id: user.id.toString(),
              image,
              name: user.name,
              role: user.role
            }
          } else {
            throw new CredentialsSignin('Invalid credentials')
          }
        } catch (error) {
          if (error instanceof CredentialsSignin) {
            throw error
          }
          logger.error('Authentication error', error, {
            email: credentials?.email
          })
          throw new Error('An unexpected error occurred during authentication')
        }
      }
    })
  ],
  events: {
    async signIn({ user }) {
      if (user.id) {
        // Use service directly since this is server-side
        const { analyticsService } = await import('@/features/analytics/lib')
        analyticsService
          .trackEvent({
            eventType: 'user_login',
            userId: user.id,
            path: '/login'
          })
          .catch((err) => logger.error('Analytics error', err))
      }
    },
    async createUser({ user }) {
      if (user.id) {
        const { analyticsService } = await import('@/features/analytics/lib')
        analyticsService
          .trackEvent({
            eventType: 'user_register',
            userId: user.id,
            path: '/register'
          })
          .catch((err) => logger.error('Analytics error', err))
      }
    }
  },
  secret: env.NEXTAUTH_SECRET
})
