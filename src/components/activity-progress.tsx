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
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 px-3 sm:px-6 pt-3 sm:pt-6 pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-white text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Last 7 Days</span>
          </CardTitle>
          <Link href="/log-activity">
            <Button size="sm" className="bg-white text-neutral-950 hover:bg-neutral-200 h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Log Activity
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div className="text-center p-2 sm:p-3 bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="text-xl sm:text-2xl font-bold text-white">{totalWorkouts}</div>
              <div className="text-xs sm:text-sm text-neutral-400">Workouts</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="text-xl sm:text-2xl font-bold text-white">{totalActivities}</div>
              <div className="text-xs sm:text-sm text-neutral-400">Activities</div>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-medium text-base sm:text-lg text-white">Daily Breakdown</h4>
            <div className="space-y-2 sm:space-y-3">
              {weeklyActivity.dailyBreakdown.length > 0 ? (
                weeklyActivity.dailyBreakdown.map((day) => {
                  const totalForDay = day.workouts + day.activities
                  // Progress based on activities only
                  const dayProgress = Math.min(Math.round((day.activities / effectiveDailyGoal) * 100), 100)
                  
                  return (
                    <div key={day.date} className="bg-neutral-800 p-2.5 sm:p-3 md:p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all duration-200">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="text-left">
                          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{getDayName(day.date)}</div>
                          <div className="text-xs sm:text-sm font-semibold text-neutral-200">{getFormattedDate(day.date)}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-neutral-500">Total</div>
                          <div className="text-sm sm:text-base font-bold text-white">{totalForDay}</div>
                        </div>
                      </div>
                      
                      {/* Activity Counts */}
                      {totalForDay > 0 ? (
                        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
                          {day.workouts > 0 && (
                            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-emerald-950/30 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-900/50">
                              <GymIcon icon={gymIcons.fitness} className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                              <span className="text-xs sm:text-sm font-semibold text-emerald-300">{day.workouts}</span>
                              <span className="text-xs text-emerald-400 hidden sm:inline">workouts</span>
                              <span className="text-xs text-emerald-400 sm:hidden">wo</span>
                            </div>
                          )}
                          
                          {day.activities > 0 && (
                            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-teal-950/30 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-teal-900/50">
                              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-teal-400" />
                              <span className="text-xs sm:text-sm font-semibold text-teal-300">{day.activities}</span>
                              <span className="text-xs text-teal-400 hidden sm:inline">activities</span>
                              <span className="text-xs text-teal-400 sm:hidden">act</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center mb-2 sm:mb-3 text-xs sm:text-sm text-neutral-500">
                          No activity
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-700 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${dayProgress}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6 sm:py-8 text-neutral-500">
                  <p className="text-sm sm:text-base">No activity recorded yet.</p>
                  <p className="text-xs sm:text-sm mt-2">Start logging your workouts and activities!</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-neutral-300">
              <span>Weekly Goal Progress</span>
              <span className="font-semibold">{weeklyProgress}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-300" 
                style={{ width: `${weeklyProgress}%` }} 
              />
            </div>
            <p className="text-xs text-neutral-500">
              {getProgressMessage(weeklyProgress)}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error('Error fetching activity progress:', error)
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-3 sm:pb-6">
          <CardTitle className="flex items-center text-white text-sm sm:text-base">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-center py-6 sm:py-8 text-neutral-500">
            <p className="text-sm sm:text-base">Unable to load activity data.</p>
            <p className="text-xs sm:text-sm mt-2">Please try refreshing the page.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}
