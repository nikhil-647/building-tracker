import { Activity, TrendingUp, Target, Calendar, Heart, Dumbbell, Zap, BarChart3, CheckCircle2, ArrowRight, Sparkles, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GymIcon, gymIcons } from "@/lib/gym-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="container relative mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8 shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4" />
            Transform Your Life Today
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
              Track. Achieve.
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dominate.
            </span>
          </h1>
          
          <p className="text-2xl text-slate-700 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Your all-in-one platform to crush fitness goals, build unbreakable habits, 
            and become the <span className="text-green-600 font-bold">best version of yourself</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="px-10 py-7 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 group">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-bold border-2 border-green-300 bg-white/80 backdrop-blur hover:bg-green-50 hover:border-green-500 hover:scale-105 transition-all duration-300 text-green-700 hover:text-green-900">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Setup in 2 Minutes</span>
            </div>
          </div>
        </div>

        {/* Features Grid - Enhanced */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {/* Feature 1 */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:border-green-400 hover:-translate-y-2 border-2 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2 group-hover:text-green-600 transition-colors">Workout Mastery</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Track every rep, set, and PR. Build custom workout plans and watch your strength explode with intelligent progress tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                <span>Start Training</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:border-emerald-400 hover:-translate-y-2 border-2 bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2 group-hover:text-emerald-600 transition-colors">Habit Streaks</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Build unstoppable momentum with daily activity tracking. Turn good intentions into rock-solid routines that last forever.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
                <span>Build Habits</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:border-teal-400 hover:-translate-y-2 border-2 bg-gradient-to-br from-white to-teal-50">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2 group-hover:text-teal-600 transition-colors">Visual Progress</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                See your transformation unfold with stunning charts and insights. Every workout, every habit, every win—visualized beautifully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all">
                <span>View Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof / Stats Section */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 border-0 shadow-2xl max-w-6xl mx-auto mb-24 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <CardContent className="pt-16 pb-16 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-3">Why People Love Us</h2>
              <p className="text-slate-300 text-lg">The numbers speak for themselves</p>
            </div>
            <div className="grid md:grid-cols-4 gap-12 text-center">
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-12 h-12 text-yellow-400 group-hover:scale-125 transition-transform animate-pulse" />
                </div>
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">100%</div>
                <div className="text-slate-300 font-semibold">Free Forever</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-12 h-12 text-emerald-400 group-hover:scale-125 transition-transform animate-pulse delay-100" />
                </div>
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">2min</div>
                <div className="text-slate-300 font-semibold">Quick Setup</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-12 h-12 text-red-400 group-hover:scale-125 transition-transform animate-pulse delay-200" />
                </div>
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">∞</div>
                <div className="text-slate-300 font-semibold">Unlimited Tracking</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Activity className="w-12 h-12 text-green-400 group-hover:scale-125 transition-transform animate-pulse delay-300" />
                </div>
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">24/7</div>
                <div className="text-slate-300 font-semibold">Always Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-5xl font-black text-white mb-6">Ready to Level Up?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands crushing their goals. Your transformation starts with a single click.
          </p>
          <div className="flex justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-12 py-7 text-xl font-bold bg-white text-green-600 hover:bg-slate-100 shadow-xl hover:scale-110 transition-all duration-300">
                Get Started Now - It's Free!
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-32 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            <p className="text-slate-700 font-semibold text-lg">Built with passion for better habits</p>
          </div>
          <p className="text-slate-500">Start your journey today. No credit card. No hassle. Just results.</p>
        </div>
      </footer>
    </div>
  );
}
