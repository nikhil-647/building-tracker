import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Calendar, Dumbbell, Activity } from 'lucide-react'

interface ActivityData {
  date: string
  workouts: number
  activities: number
  totalMinutes: number
}

const mockActivityData: ActivityData[] = [
  { date: '2024-01-15', workouts: 1, activities: 3, totalMinutes: 45 },
  { date: '2024-01-14', workouts: 0, activities: 2, totalMinutes: 30 },
  { date: '2024-01-13', workouts: 2, activities: 1, totalMinutes: 60 },
  { date: '2024-01-12', workouts: 1, activities: 4, totalMinutes: 75 },
  { date: '2024-01-11', workouts: 0, activities: 1, totalMinutes: 20 },
  { date: '2024-01-10', workouts: 1, activities: 2, totalMinutes: 50 },
  { date: '2024-01-09', workouts: 2, activities: 3, totalMinutes: 90 },
]

export function ActivityProgress() {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const totalWorkouts = mockActivityData.reduce((sum, day) => sum + day.workouts, 0)
  const totalActivities = mockActivityData.reduce((sum, day) => sum + day.activities, 0)
  const totalMinutes = mockActivityData.reduce((sum, day) => sum + day.totalMinutes, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Last 7 Days Activity Progress
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalWorkouts}</div>
            <div className="text-sm text-muted-foreground">Workouts</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalActivities}</div>
            <div className="text-sm text-muted-foreground">Activities</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Daily Breakdown</h4>
          <div className="space-y-3">
            {mockActivityData.map((day, index) => (
              <div key={day.date} className="bg-gradient-to-r from-muted/30 to-muted/10 p-4 rounded-xl border border-border/50 hover:border-border transition-all duration-200">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{getDayName(day.date)}</div>
                    <div className="text-sm font-semibold">{getFormattedDate(day.date)}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Activity Level</div>
                    <div className="text-sm font-bold text-primary">{Math.round((day.totalMinutes / 90) * 100)}%</div>
                  </div>
                </div>
                
                {/* Activity Counts */}
                <div className="flex justify-center space-x-6 mb-3">
                  <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-full">
                    <Dumbbell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{day.workouts}</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">workouts</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-teal-50 dark:bg-teal-950/30 px-4 py-2 rounded-full">
                    <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">{day.activities}</span>
                    <span className="text-xs text-teal-600 dark:text-teal-400">activities</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((day.totalMinutes / 90) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Weekly Goal Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '75%' }} />
          </div>
          <p className="text-xs text-muted-foreground">
            You're on track! Keep up the great work.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
