"use client"

import { Dumbbell, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from 'next-auth/react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { AuthLoading } from '@/components/auth-loading';

export default function Home() {
  const isLoading = useAuthRedirect();

  // Show loading while checking session
  if (isLoading) {
    return <AuthLoading />;
  }
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white">
              Tapas
            </h1>
            <p className="text-2xl text-neutral-400 font-light max-w-2xl mb-8">
              A straightforward system to log workouts and track daily habits.
            </p>
            
            {/* CTA - Moved up */}
            <div className="mb-4">
              <Button 
                size="lg" 
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="px-8 py-6 text-base font-medium bg-white text-neutral-950 hover:bg-neutral-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
              <p className="text-sm text-neutral-500 mt-3">
                Requires Google account for authentication
              </p>
            </div>
          </div>

          {/* Core Features */}
          <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-neutral-800">
            {/* Feature 1 - Log Workout */}
            <div className="bg-neutral-900 border border-neutral-800 p-8 hover:border-neutral-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-neutral-800 p-3 rounded">
                  <Dumbbell className="w-6 h-6 text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Log Workout</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Record exercises, sets, reps, and weight. Track your training progress over time.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Track Habits */}
            <div className="bg-neutral-900 border border-neutral-800 p-8 hover:border-neutral-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-neutral-800 p-3 rounded">
                  <CheckSquare className="w-6 h-6 text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Track Daily Habits</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Mark daily activities complete. Build consistency through simple daily tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-32">
        <div className="container mx-auto px-4 py-8">
          <p className="text-neutral-600 text-sm text-center">
            Tapas — 2025 · Built by{' '}
            <a 
              href="https://nikzone.click" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-neutral-200 transition-colors underline"
            >
              nikzone.click
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
