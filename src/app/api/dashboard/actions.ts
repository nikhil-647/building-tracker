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

  // Fetch current month's workout logs count
  const currentMonthWorkouts = await db.workoutLog.count({
    where: {
      userId: user.id,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd
      }
    }
  })

  // Fetch previous month's workout logs count
  const previousMonthWorkouts = await db.workoutLog.count({
    where: {
      userId: user.id,
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd
      }
    }
  })

  // Fetch current month's completed activities
  const currentMonthActivities = await db.dailyActivity.count({
    where: {
      userId: user.id,
      status: 'completed',
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd
      }
    }
  })

  // Fetch previous month's completed activities
  const previousMonthActivities = await db.dailyActivity.count({
    where: {
      userId: user.id,
      status: 'completed',
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd
      }
    }
  })

  // Calculate changes
  const workoutsChange = currentMonthWorkouts - previousMonthWorkouts
  const activitiesChange = currentMonthActivities - previousMonthActivities

  // Fetch user's daily goal (count of active activity templates)
  const dailyGoal = await db.activityTemplate.count({
    where: {
      userId: user.id,
      isActive: true
    }
  })

  // Fetch today + last 6 days activity data (7 days total)
  const today = dayjs.utc().startOf('day')
  const last7DaysStart = today.subtract(6, 'day').toDate()
  const last7DaysEnd = today.endOf('day').toDate()

  // Fetch workout logs for today + last 6 days
  const last7DaysWorkoutLogs = await db.workoutLog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: last7DaysStart,
        lte: last7DaysEnd
      }
    },
    select: {
      date: true
    }
  })

  // Fetch completed activities for today + last 6 days
  const last7DaysActivities = await db.dailyActivity.findMany({
    where: {
      userId: user.id,
      status: 'completed',
      date: {
        gte: last7DaysStart,
        lte: last7DaysEnd
      }
    },
    select: {
      date: true
    }
  })

  // Create daily breakdown
  const dailyBreakdown: DailyActivityData[] = []
  let totalWorkouts = 0
  let totalActivities = 0

  // Generate all 7 days: today (i=0) + last 6 days (i=1 to 6)
  for (let i = 0; i <= 6; i++) {
    const currentDate = today.subtract(i, 'day')
    const dateString = currentDate.format('YYYY-MM-DD')

    // Count workouts for this date
    const workoutsForDay = last7DaysWorkoutLogs.filter(log => {
      return dayjs.utc(log.date).format('YYYY-MM-DD') === dateString
    }).length

    // Count activities for this date
    const activitiesForDay = last7DaysActivities.filter(activity => {
      return dayjs.utc(activity.date).format('YYYY-MM-DD') === dateString
    }).length

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

