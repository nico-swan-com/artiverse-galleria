import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.picture = user.image
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
