import { Navbar } from '@/components/navbar'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { DashboardStats } from '@/components/dashboard-stats'
import { ActivityProgress } from '@/components/activity-progress'
import { HeroButtons } from '@/components/hero-buttons'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()
  
  // Redirect to homepage if not authenticated
  if (!session?.user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar user={session.user} />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 pb-20 md:pb-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Track your progress and build consistency.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <HeroButtons />
        </div>

        {/* Stats Grid */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <DashboardStats />
        </div>

        {/* Activity Progress - Full width */}
        <ActivityProgress />
      </main>

      <MobileBottomNav />
    </div>
  )
}