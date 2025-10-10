import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace this with your actual database logic
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        // Example: Check against hardcoded user (REPLACE THIS with database query)
        if (credentials.email === "user@example.com" && credentials.password === "password123") {
          return {
            id: "1",
            name: "John Doe",
            email: "user@example.com"
          }
        }
        // Return null if user not found or password incorrect
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

