"use server"

/**
 * Signup Server Action
 * 
 * This file handles user registration with:
 * - Zod validation for email, password, and name
 * - Database user creation via Prisma
 * - Automatic sign-in after successful registration
 * - Error handling for duplicate emails
 */

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { signIn } from "@/lib/auth"
import { signupSchema } from "@/lib/validations/auth"

// Type for form state
type FormState = {
  errors?: {
    email?: string[]
    password?: string[]
    name?: string[]
    confirmPassword?: string[]
    _form?: string[]
  }
  data?: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }
  success?: boolean
}

/**
 * Signup Action - Creates new user and signs them in
 * 
 * @param formState - Previous form state
 * @param formData - Form data from the signup form
 * @returns Form state with errors or success
 */
export async function signup(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract form data
    const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    }

    // Validate with Zod
    const validatedFields = signupSchema.safeParse(rawFormData)

    // If validation fails, return errors with submitted data
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        data: {
          name: rawFormData.name as string,
          email: rawFormData.email as string,
          password: rawFormData.password as string,
          confirmPassword: rawFormData.confirmPassword as string
        }
      }
    }

    const { name, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        errors: {
          email: ['An account with this email already exists']
        },
        data: {
          name,
          email,
          password,
          confirmPassword: validatedFields.data.confirmPassword
        }
      }
    }

    // ⚠️ IMPORTANT: In production, hash the password with bcrypt
    // Example:
    // const bcrypt = require('bcrypt')
    // const hashedPassword = await bcrypt.hash(password, 10)
    
    // For now, storing plain text (DEVELOPMENT ONLY - INSECURE!)
    const hashedPassword = password // Replace with bcrypt.hash(password, 10) in production

    // Create new user in database
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    console.log('✅ User created successfully:', newUser.email)

    // Automatically sign in the user after signup
    await signIn('credentials', {
      email,
      password,
      redirect: false
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message || 'Something went wrong. Please try again.']
        },
        data: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          confirmPassword: formData.get('confirmPassword') as string
        }
      }
    }

    return {
      errors: {
        _form: ['Something went wrong. Please try again.']
      },
      data: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string
      }
    }
  }

  // Redirect to dashboard after successful signup
  redirect('/dashboard')
}

