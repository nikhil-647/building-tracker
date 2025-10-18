import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook to redirect authenticated users to dashboard
 * Used on public pages like login, signup
 * 
 * @param redirectTo - The path to redirect authenticated users to (default: '/dashboard')
 * @returns loading state (true while checking session)
 */
export function useAuthRedirect(redirectTo: string = '/dashboard') {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  return status === 'loading';
}

