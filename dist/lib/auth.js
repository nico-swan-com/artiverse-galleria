import crypto from 'crypto'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AppDataSource } from '@/lib/database/data-source'
import { User } from '@/lib/database/entities/auth/user.entity'
const getGravatar = (email, name) => {
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
        const email = credentials.email
        const password = credentials.password
        try {
          await AppDataSource.initialize()
          const userRepository = AppDataSource.getRepository(User)
          const user = await userRepository.findOne({
            where: { email }
          })
          if (!user) {
            return null
          }
          const passwordMatch = await user.validatePassword(password)
          if (passwordMatch) {
            return {
              email: user.email,
              id: user.id.toString(),
              avatar: getGravatar(user.email, user.name),
              name: user.name
            }
          } else {
            return null
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        } finally {
          if (AppDataSource.isInitialized) {
            await AppDataSource.destroy()
          }
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
      }
      return token
    },
    async session({ session, token }) {
      if (token && typeof token.id === 'string') {
        session.user.id = token.id
      }
      return session
    }
  }
})
