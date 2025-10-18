import { redirect } from 'next/navigation';
import { auth } from './auth';

/**
 * Server-side helper to redirect authenticated users
 * Use this in server components to prevent logged-in users from accessing public pages
 * 
 * @param redirectTo - The path to redirect authenticated users to (default: '/dashboard')
 */
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const session = await auth();
  if (session?.user) {
    redirect(redirectTo);
  }
}

/**
 * Server-side helper to redirect unauthenticated users
 * Use this in server components to protect pages that require authentication
 * 
 * @param redirectTo - The path to redirect unauthenticated users to (default: '/login')
 */
export async function redirectIfNotAuthenticated(redirectTo: string = '/login') {
  const session = await auth();
  if (!session?.user) {
    redirect(redirectTo);
  }
}

