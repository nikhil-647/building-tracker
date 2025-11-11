import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "./db"

/**
 * NextAuth Configuration with Database Integration
 * 
 * This file configures authentication using:
 * - Google OAuth provider
 * - JWT session strategy (stateless, no session table needed)
 * - Prisma database for user lookup
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Handle user sign-in for OAuth providers
    async signIn({ user, account }) {
      // For OAuth providers (like Google), create user if doesn't exist
      if (account?.provider === "google") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user for OAuth sign-in
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image,
                password: '', // Empty password for OAuth users
              }
            })
          } else {
            // Update existing user's image if it changed
            if (user.image && existingUser.image !== user.image) {
              await db.user.update({
                where: { email: user.email! },
                data: { image: user.image }
              })
            }
          }
        } catch (error) {
          console.error("Error during OAuth sign-in:", error)
          return false
        }
      }
      return true
    },
    // Add user id to JWT token
    async jwt({ token, user, account }) {
      if (user) {
        // Fetch user from database to get the ID
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
          select: { id: true }
        })
        if (dbUser) {
          token.id = dbUser.id.toString()
        }
      }
      return token
    },
    // Add user id to session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})

