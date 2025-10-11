import { Navbar } from '@/components/navbar'
import { DashboardStats } from '@/components/dashboard-stats'
import { ActivityProgress } from '@/components/activity-progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Activity } from 'lucide-react'

export default function Dashboard() {
  // Mock user data - in real app, this would come from session
  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Activity Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Track your workouts and activities. Keep building healthy habits!
            </p>
          </div>
          
          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8">
              <Dumbbell className="h-5 w-5 mr-2" />
              Log Workout
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8">
              <Activity className="h-5 w-5 mr-2" />
              Log Activity
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Progress - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ActivityProgress />
          </div>
          
          {/* Sidebar Content */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                    <span className="text-sm">Workout logged: Strength Training</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">2 hours ago</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-teal-500 rounded-full" />
                    <span className="text-sm">Activity logged: Morning Walk</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">4 hours ago</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-lime-500 rounded-full" />
                    <span className="text-sm">Weekly goal reminder</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">1 day ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}