import * as React from 'react'
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GymIcon, gymIcons } from '@/lib/gym-icons'
import { getDashboardStats } from '@/app/api/dashboard/actions'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
}

export function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {changeType === 'increase' ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
          ) : changeType === 'decrease' ? (
            <ArrowDownRight className="h-3 w-3 text-orange-500 mr-1" />
          ) : null}
          <span className={
            changeType === 'increase' 
              ? 'text-emerald-500' 
              : changeType === 'decrease' 
              ? 'text-orange-500' 
              : 'text-muted-foreground'
          }>
            {change}
          </span>
          <span className="ml-1">from last month</span>
        </p>
      </CardContent>
    </Card>
  )
}

export async function DashboardStats() {
  try {
    const stats = await getDashboardStats()

    // Format workout change
    const workoutChange = stats.changes.workoutsChange
    const workoutChangeStr = workoutChange > 0 
      ? `+${workoutChange}` 
      : workoutChange < 0 
      ? `${workoutChange}` 
      : '0'
    const workoutChangeType = workoutChange > 0 
      ? 'increase' 
      : workoutChange < 0 
      ? 'decrease' 
      : 'neutral'

    // Format activities change
    const activitiesChange = stats.changes.activitiesChange
    const activitiesChangeStr = activitiesChange > 0 
      ? `+${activitiesChange}` 
      : activitiesChange < 0 
      ? `${activitiesChange}` 
      : '0'
    const activitiesChangeType = activitiesChange > 0 
      ? 'increase' 
      : activitiesChange < 0 
      ? 'decrease' 
      : 'neutral'

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total Workouts"
          value={stats.currentMonth.totalWorkouts.toString()}
          change={workoutChangeStr}
          changeType={workoutChangeType}
          icon={<GymIcon icon={gymIcons.fitness} className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Activities Logged"
          value={stats.currentMonth.activitiesLogged.toString()}
          change={activitiesChangeStr}
          changeType={activitiesChangeType}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total Workouts"
          value="0"
          change="0"
          changeType="neutral"
          icon={<GymIcon icon={gymIcons.fitness} className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Activities Logged"
          value="0"
          change="0"
          changeType="neutral"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    )
  }
}
