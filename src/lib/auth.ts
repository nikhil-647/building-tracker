import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { db } from "./db"

/**
 * NextAuth Configuration with Database Integration
 * 
 * This file configures authentication using:
 * - Credentials provider (email/password)
 * - Google OAuth provider
 * - JWT session strategy (stateless, no session table needed)
 * - Prisma database for user lookup
 * 
 * Security Notes:
 * - Passwords should be hashed with bcrypt (not implemented yet)
 * - Add rate limiting to prevent brute force attacks
 * - Consider adding 2FA for enhanced security
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate that credentials exist
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password")
            return null
          }

          // Query database for user by email
          const user = await db.user.findUnique({
            where: {
              email: credentials.email as string
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              image: true
            }
          })

          // User not found
          if (!user) {
            console.error("User not found:", credentials.email)
            return null
          }

          // ⚠️ IMPORTANT: In production, use bcrypt to compare hashed passwords
          // Example with bcrypt:
          // const bcrypt = require('bcrypt')
          // const isValid = await bcrypt.compare(credentials.password, user.password)
          // if (!isValid) return null
          
          // For now, comparing plain text (INSECURE - FOR DEVELOPMENT ONLY)
          const isPasswordValid = credentials.password === user.password

          if (!isPasswordValid) {
            console.error("Invalid password for user:", credentials.email)
            return null
          }

          // Return user object (will be encoded in JWT)
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
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

