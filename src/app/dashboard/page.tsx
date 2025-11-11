import { Navbar } from '@/components/navbar'
import { DashboardStats } from '@/components/dashboard-stats'
import { ActivityProgress } from '@/components/activity-progress'
import { HeroButtons } from '@/components/hero-buttons'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar user={session.user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-400">
            Track your progress and build consistency.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <HeroButtons />
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Activity Progress - Full width */}
        <ActivityProgress />
      </main>
    </div>
  )
}