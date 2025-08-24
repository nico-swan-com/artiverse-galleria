import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { getAvatarUrl } from '../utilities'
import { UsersRepository } from '../users'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          const users = new UsersRepository()

          const email: string = credentials.email as string
          const password: string = credentials.password as string

          const user = await users.getUserByEmail(email)

          if (!user) {
            return null
          }

          const passwordMatch = await user.validatePassword(password)
          const image = getAvatarUrl(user.email, user.name)

          if (passwordMatch) {
            return {
              email: user.email,
              id: user.id.toString(),
              image,
              name: user.name,
              role: user.role
            }
          } else {
            return null
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
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
})
