/**
 * Database Client Utility
 * 
 * This file creates a singleton Prisma Client instance to prevent
 * multiple database connections in development mode (hot reloading).
 * 
 * Why singleton?
 * - Next.js hot-reloads in dev, which can create many PrismaClient instances
 * - Too many instances = database connection exhaustion
 * - We use globalThis to persist the client across hot reloads
 */

import { PrismaClient } from '@prisma/client'

// Extend the global type to include our prisma property
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Create Prisma Client with logging (optional)
 * 
 * You can enable query logs to see SQL queries in development:
 * log: ['query', 'error', 'warn']
 */
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

// In development, save the instance to globalThis to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

/**
 * Usage in your app:
 * 
 * import { db } from '@/lib/db'
 * 
 * const users = await db.user.findMany()
 * const user = await db.user.findUnique({ where: { email: 'test@example.com' } })
 * const newUser = await db.user.create({ data: { ... } })
 */

