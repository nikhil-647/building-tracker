import { Navbar } from '@/components/navbar'
import { DashboardStats } from '@/components/dashboard-stats'
import { ActivityProgress } from '@/components/activity-progress'
import { HeroButtons } from '@/components/hero-buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Activity } from 'lucide-react'

export default async function Dashboard() {
  const session = await auth()
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-700"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navbar user={session.user} />
        
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                <Activity className="w-4 h-4" />
                Your Dashboard
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Activity Dashboard
              </h1>
              <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
                Track your workouts and activities. Keep building healthy habits!
              </p>
            </div>
            
            {/* Hero Buttons */}
            <HeroButtons />
          </div>

          {/* Stats Grid */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity Progress - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <ActivityProgress />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}