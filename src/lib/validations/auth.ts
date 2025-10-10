/**
 * Authentication Validation Schemas
 * 
 * Reusable Zod schemas for auth-related forms.
 * Can be imported and used across different components.
 */

import { z } from "zod"

/**
 * Signup Schema - Validates new user registration
 */
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

/**
 * Login Schema - Validates user login
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

/**
 * Strong Password Schema - For production use
 * Requires: 8+ chars, uppercase, lowercase, number, special char
 */
export const strongPasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

/**
 * Email Schema - Reusable email validation
 */
export const emailSchema = z.string().email('Invalid email address')

/**
 * Password Reset Schema - Validates password reset
 */
export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address')
})

/**
 * Update Password Schema - For password change in profile
 */
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
})

// Type exports for use in components
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>

