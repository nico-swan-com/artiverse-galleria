import crypto from 'crypto'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UsersRepository } from '@/lib/data-access/users/users.repository'

const getGravatar = (email: string, name: string): string | undefined => {
  if (email && name) {
    const trimmedEmail = email.trim().toLowerCase()
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex')
    return `https://www.gravatar.com/avatar/${hash}?d=https%3A%2F%2Fui-avatars.com%2Fapi%2F/${encodeURI(name)}/128`
  }
  return
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const users = new UsersRepository()

        const email: string = credentials.email as string
        const password: string = credentials.password as string

        try {
          const user = await users.getUserByEmail(email)

          if (!user) {
            return null
          }

          const passwordMatch = await user.validatePassword(password)
          const image = getGravatar(user.email, user.name)

          if (passwordMatch) {
            return {
              email: user.email,
              id: user.id.toString(),
              image,
              name: user.name
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
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      //  TODO can we do attribute based access control here?
      return !!auth
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token && typeof token.id === 'string') {
        session.user.id = token.id
        session.user.image = token.picture
      }
      return session
    }
  }
})
