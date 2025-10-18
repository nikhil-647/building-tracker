"use client"

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from 'next-auth/react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mail, Lock, User, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import { signup } from "./actions";
import { toast } from 'sonner';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { AuthLoading } from '@/components/auth-loading';

// Submit button component that shows loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full py-6 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-green-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Creating account..." : "Create Account"}
    </Button>
  );
}

export default function SignUpPage() {
  const isLoading = useAuthRedirect();
  const [state, formAction] = useActionState(signup, { errors: {} });

  // Show toast notifications when errors occur
  useEffect(() => {
    if (state.errors?._form) {
      toast.error('Signup failed', {
        description: state.errors._form[0] || 'Please check your information and try again.'
      })
    }
  }, [state.errors?._form])

  // Show loading while checking session
  if (isLoading) {
    return <AuthLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-green-600 mb-6 transition-colors font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <Card className="shadow-2xl border-2 border-green-100 hover:border-green-200 transition-all">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold mx-auto">
              <Sparkles className="w-3 h-3" />
              Start Your Journey
            </div>
            <CardTitle className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Join Now
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              Create your account and unlock your potential
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form action={formAction} className="space-y-4">
              {/* Form-level errors */}
              {state.errors?._form && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    {state.errors._form.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    defaultValue={state.data?.name || ''}
                    className={`pl-10 ${state.errors?.name ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {state.errors?.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    defaultValue={state.data?.email || ''}
                    className={`pl-10 ${state.errors?.email ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {state.errors?.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue={state.data?.password || ''}
                    className={`pl-10 ${state.errors?.password ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {state.errors?.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    defaultValue={state.data?.confirmPassword || ''}
                    className={`pl-10 ${state.errors?.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {state.errors?.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <SubmitButton />

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or</span>
                </div>
              </div>

              {/* Social Sign Up Buttons */}
              <div className="space-y-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full py-6 text-base hover:bg-green-50 hover:border-green-300 border-2 transition-all hover:scale-[1.02]"
                  onClick={() => signIn('google')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-700 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-center text-sm text-slate-600 mt-6 font-medium">
          By signing up, you agree to our{" "}
          <Link href="#" className="text-green-600 underline hover:text-green-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-green-600 underline hover:text-green-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

