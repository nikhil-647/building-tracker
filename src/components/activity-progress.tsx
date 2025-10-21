import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Activity } from 'lucide-react'
import { GymIcon, gymIcons } from '@/lib/gym-icons'
import { getDashboardStats } from '@/app/api/dashboard/actions'
import Link from 'next/link'

export async function ActivityProgress() {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  try {
    const stats = await getDashboardStats()
    const { weeklyActivity, dailyGoal } = stats
    
    const totalWorkouts = weeklyActivity.summary.totalWorkouts
    const totalActivities = weeklyActivity.summary.totalActivities
    // Calculate weekly progress as average of daily percentages
    // dailyGoal = count of user's active activity templates
    // Progress is based on activities only (not workouts)
    // If dailyGoal is 0, set a default of 1 to avoid division by zero
    const effectiveDailyGoal = dailyGoal || 1
    const dailyPercentages = weeklyActivity.dailyBreakdown.map(day => {
      return Math.min((day.activities / effectiveDailyGoal) * 100, 100)
    })
    const weeklyProgress = Math.round(
      dailyPercentages.reduce((sum, percentage) => sum + percentage, 0) / dailyPercentages.length
    )
    
    // Calculate progress message
    const getProgressMessage = (progress: number) => {
      if (progress >= 100) return "Excellent work! You've exceeded your weekly goal! 🎉"
      if (progress >= 75) return "You're on track! Keep up the great work."
      if (progress >= 50) return "Good progress! Keep going."
      if (progress >= 25) return "Nice start! Keep building momentum."
      return "Let's get started! Every step counts."
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today + Last 6 Days
          </CardTitle>
          <Link href="/log-activity">
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalWorkouts}</div>
              <div className="text-sm text-muted-foreground">Workouts</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalActivities}</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Daily Breakdown</h4>
            <div className="space-y-3">
              {weeklyActivity.dailyBreakdown.length > 0 ? (
                weeklyActivity.dailyBreakdown.map((day) => {
                  const totalForDay = day.workouts + day.activities
                  // Progress based on activities only
                  const dayProgress = Math.min(Math.round((day.activities / effectiveDailyGoal) * 100), 100)
                  
                  return (
                    <div key={day.date} className="bg-gradient-to-r from-muted/30 to-muted/10 p-4 rounded-xl border border-border/50 hover:border-border transition-all duration-200">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-center">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{getDayName(day.date)}</div>
                          <div className="text-sm font-semibold">{getFormattedDate(day.date)}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Total</div>
                          <div className="text-sm font-bold text-primary">{totalForDay}</div>
                        </div>
                      </div>
                      
                      {/* Activity Counts */}
                      {totalForDay > 0 ? (
                        <div className="flex justify-center space-x-6 mb-3">
                          {day.workouts > 0 && (
                            <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-full">
                              <GymIcon icon={gymIcons.fitness} className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{day.workouts}</span>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">workouts</span>
                            </div>
                          )}
                          
                          {day.activities > 0 && (
                            <div className="flex items-center space-x-2 bg-teal-50 dark:bg-teal-950/30 px-4 py-2 rounded-full">
                              <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">{day.activities}</span>
                              <span className="text-xs text-teal-600 dark:text-teal-400">activities</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center mb-3 text-sm text-muted-foreground">
                          No activity recorded
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${dayProgress}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activity recorded yet.</p>
                  <p className="text-sm mt-2">Start logging your workouts and activities!</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Goal Progress</span>
              <span>{weeklyProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${weeklyProgress}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {getProgressMessage(weeklyProgress)}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error('Error fetching activity progress:', error)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today + Last 6 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Unable to load activity data.</p>
            <p className="text-sm mt-2">Please try refreshing the page.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}
