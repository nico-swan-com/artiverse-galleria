import type { NextAuthConfig } from 'next-auth'
import { db } from '@/lib/database/drizzle'
import { users } from '@/lib/database/schema'
import { eq } from 'drizzle-orm'
import { getAvatarUrl } from '@/lib/utilities/get-avatar-url'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial login - set basic user info
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.picture = user.image
      }

      // Fetch fresh user data from database on each token refresh
      // This ensures avatar changes are reflected immediately
      if (token.id && typeof token.id === 'string') {
        try {
          const freshUser = await db.query.users.findFirst({
            where: eq(users.id, token.id),
            columns: {
              avatar: true,
              name: true,
              email: true,
              role: true
            }
          })

          if (freshUser) {
            token.picture =
              freshUser.avatar || getAvatarUrl(freshUser.email, freshUser.name)
            token.role = freshUser.role
          }
        } catch (error) {
          // Silently fail - use cached token data if DB fetch fails
          console.error('Failed to fetch fresh user data:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && typeof token.id === 'string') {
        session.user.id = token.id
        session.user.role = token.role
        session.user.image = token.picture
      }
      return session
    }
  }
} satisfies NextAuthConfig
