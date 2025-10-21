'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export interface DailyActivityData {
  date: string // ISO date string (YYYY-MM-DD)
  workouts: number
  activities: number
}

export interface WeeklyActivityData {
  summary: {
    totalWorkouts: number
    totalActivities: number
  }
  dailyBreakdown: DailyActivityData[]
}

export interface DashboardStats {
  currentMonth: {
    totalWorkouts: number
    activitiesLogged: number
  }
  previousMonth: {
    totalWorkouts: number
    activitiesLogged: number
  }
  changes: {
    workoutsChange: number
    activitiesChange: number
  }
  weeklyActivity: WeeklyActivityData
  dailyGoal: number // Number of active activity templates
}

/**
 * Fetches dashboard statistics for the authenticated user
 * - Total workouts for current month (count of workout logs)
 * - Activities logged for current month (count of completed daily activities)
 * - Comparison with previous month
 * - Weekly activity data (today + last 6 days)
 * - User's daily goal (count of active activity templates)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await auth()

  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Get current date and calculate date ranges using UTC
  const now = dayjs.utc()
  const currentMonthStart = now.startOf('month').toDate()
  const currentMonthEnd = now.endOf('month').toDate()
  const previousMonthStart = now.subtract(1, 'month').startOf('month').toDate()
  const previousMonthEnd = now.subtract(1, 'month').endOf('month').toDate()
  const today = dayjs.utc().startOf('day')
  const last7DaysStart = today.subtract(6, 'day').toDate()
  const last7DaysEnd = today.endOf('day').toDate()

  // 🚀 IMPROVEMENT #1: Parallel Queries
  // Execute all independent queries simultaneously instead of sequentially
  // This reduces total query time from sum of all queries to max of any single query
  const [
    currentMonthWorkouts,
    previousMonthWorkouts,
    currentMonthActivities,
    previousMonthActivities,
    dailyGoal,
    weeklyWorkoutData,
    weeklyActivityData
  ] = await Promise.all([
    // Current month's workout logs count
    db.workoutLog.count({
      where: {
        userId: user.id,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      }
    }),
    // Previous month's workout logs count
    db.workoutLog.count({
      where: {
        userId: user.id,
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      }
    }),
    // Current month's completed activities
    db.dailyActivity.count({
      where: {
        userId: user.id,
        status: 'completed',
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      }
    }),
    // Previous month's completed activities
    db.dailyActivity.count({
      where: {
        userId: user.id,
        status: 'completed',
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd
        }
      }
    }),
    // User's daily goal (count of active activity templates)
    db.activityTemplate.count({
      where: {
        userId: user.id,
        isActive: true
      }
    }),
    // 🚀 IMPROVEMENT #2 & #3: Database-level aggregation for workouts
    // Use groupBy to aggregate at the database instead of fetching all records
    // and counting in JavaScript. This eliminates over-fetching.
    db.workoutLog.groupBy({
      by: ['date'],
      where: {
        userId: user.id,
        date: {
          gte: last7DaysStart,
          lte: last7DaysEnd
        }
      },
      _count: {
        id: true
      }
    }),
    // Database-level aggregation for activities
    db.dailyActivity.groupBy({
      by: ['date'],
      where: {
        userId: user.id,
        status: 'completed',
        date: {
          gte: last7DaysStart,
          lte: last7DaysEnd
        }
      },
      _count: {
        id: true
      }
    })
  ]);

  // Calculate changes
  const workoutsChange = currentMonthWorkouts - previousMonthWorkouts
  const activitiesChange = currentMonthActivities - previousMonthActivities

  // Build lookup maps for quick access (O(1) instead of O(n) filtering)
  const workoutsByDate = new Map<string, number>()
  weeklyWorkoutData.forEach(item => {
    const dateString = dayjs.utc(item.date).format('YYYY-MM-DD')
    workoutsByDate.set(dateString, item._count.id)
  })

  const activitiesByDate = new Map<string, number>()
  weeklyActivityData.forEach(item => {
    const dateString = dayjs.utc(item.date).format('YYYY-MM-DD')
    activitiesByDate.set(dateString, item._count.id)
  })

  // Create daily breakdown with guaranteed coverage of all 7 days
  const dailyBreakdown: DailyActivityData[] = []
  let totalWorkouts = 0
  let totalActivities = 0

  // Generate all 7 days: today (i=0) + last 6 days (i=1 to 6)
  for (let i = 0; i <= 6; i++) {
    const currentDate = today.subtract(i, 'day')
    const dateString = currentDate.format('YYYY-MM-DD')

    // Get counts from maps (0 if not found)
    const workoutsForDay = workoutsByDate.get(dateString) || 0
    const activitiesForDay = activitiesByDate.get(dateString) || 0

    dailyBreakdown.push({
      date: dateString,
      workouts: workoutsForDay,
      activities: activitiesForDay
    })

    totalWorkouts += workoutsForDay
    totalActivities += activitiesForDay
  }

  return {
    currentMonth: {
      totalWorkouts: currentMonthWorkouts,
      activitiesLogged: currentMonthActivities
    },
    previousMonth: {
      totalWorkouts: previousMonthWorkouts,
      activitiesLogged: previousMonthActivities
    },
    changes: {
      workoutsChange,
      activitiesChange
    },
    weeklyActivity: {
      summary: {
        totalWorkouts,
        totalActivities
      },
      dailyBreakdown
    },
    dailyGoal
  }
}

