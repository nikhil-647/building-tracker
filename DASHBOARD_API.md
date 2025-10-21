# Dashboard API Documentation

## Overview
The Dashboard API provides real-time statistics about user workouts and activities for the current month compared to the previous month.

## API Location
`/src/app/api/dashboard/actions.ts`

## Function: `getDashboardStats()`

### Description
Server-side action that fetches dashboard statistics for the authenticated user.

### Authentication
Requires an authenticated session via NextAuth.

### Returns
```typescript
interface DailyActivityData {
  date: string                 // ISO date string (YYYY-MM-DD)
  workouts: number             // Count of workout logs for this day
  activities: number           // Count of completed activities for this day
}

interface WeeklyActivityData {
  summary: {
    totalWorkouts: number      // Total workouts (today + last 6 days)
    totalActivities: number    // Total activities (today + last 6 days)
  }
  dailyBreakdown: DailyActivityData[] // Array of 7 days (today + last 6 days, newest first)
}

interface DashboardStats {
  currentMonth: {
    totalWorkouts: number      // Count of workout logs for current month
    activitiesLogged: number   // Count of completed activities for current month
  }
  previousMonth: {
    totalWorkouts: number      // Count of workout logs for previous month
    activitiesLogged: number   // Count of completed activities for previous month
  }
  changes: {
    workoutsChange: number     // Difference between current and previous month workouts
    activitiesChange: number   // Difference between current and previous month activities
  }
  weeklyActivity: WeeklyActivityData // Last 7 days activity data with daily breakdown
  dailyGoal: number            // User's daily activity goal (count of active activity templates)
}
```

### Data Sources

#### Total Workouts
- **Source**: `WorkoutLog` table
- **Logic**: Counts all workout log entries for the user within the current calendar month
- **Date Field**: Uses `date` field from WorkoutLog

#### Activities Logged
- **Source**: `DailyActivity` table
- **Logic**: Counts all daily activities with `status = 'completed'` for the user within the current calendar month
- **Date Field**: Uses `date` field from DailyActivity

#### Weekly Activity Summary
- **Source**: `WorkoutLog` and `DailyActivity` tables
- **Logic**: Fetches data for today + last 6 days (7 days total), groups by date, and provides both summary and daily breakdown
- **Date Range**: Today + last 6 days (7 days total)
- **Daily Breakdown**: Returns an array of 7 objects in reverse chronological order (today first, 6 days ago last), each containing the date and counts for that day

#### Daily Goal
- **Source**: `ActivityTemplate` table
- **Logic**: Counts all activity templates with `isActive = true` for the user
- **Purpose**: Used to calculate daily and weekly progress percentages based on user's chosen daily activities

### Date Calculations
- **Current Month**: From 1st day of current month to last day of current month
- **Previous Month**: From 1st day of previous month to last day of previous month
- **Today + Last 6 Days**: From 6 days ago (at 00:00:00) to today (at 23:59:59)
  - Example: If today is October 21, the range is October 15 00:00:00 to October 21 23:59:59
  - This creates a rolling 7-day window that always includes today

### Error Handling
- Throws `Unauthorized` error if user is not authenticated
- Throws `User not found` error if user doesn't exist in database
- Component catches errors and displays fallback values (0)

### Usage Example

```typescript
import { getDashboardStats } from '@/app/api/dashboard/actions'

// In a server component
export async function DashboardPage() {
  const stats = await getDashboardStats()
  
  return (
    <div>
      {/* Monthly Stats */}
      <p>Total Workouts: {stats.currentMonth.totalWorkouts}</p>
      <p>Activities Logged: {stats.currentMonth.activitiesLogged}</p>
      <p>Workouts Change: {stats.changes.workoutsChange > 0 ? '+' : ''}{stats.changes.workoutsChange}</p>
      <p>Activities Change: {stats.changes.activitiesChange > 0 ? '+' : ''}{stats.changes.activitiesChange}</p>
      
      {/* Weekly Stats */}
      <div>
        <h3>Today + Last 6 Days</h3>
        <p>Daily Goal: {stats.dailyGoal} activities</p>
        <p>Total Workouts: {stats.weeklyActivity.summary.totalWorkouts}</p>
        <p>Total Activities: {stats.weeklyActivity.summary.totalActivities}</p>
        
        <h4>Daily Breakdown</h4>
        {stats.weeklyActivity.dailyBreakdown.map(day => (
          <div key={day.date}>
            <span>{day.date}: </span>
            <span>{day.workouts} workouts, {day.activities} activities</span>
            <span> ({Math.min(Math.round((day.workouts + day.activities) / stats.dailyGoal * 100), 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Component Integration

### DashboardStats Component
Location: `/src/components/dashboard-stats.tsx`

The `DashboardStats` component is a server component that displays monthly statistics:
1. Calls `getDashboardStats()` on the server
2. Formats the data for display
3. Shows increase/decrease indicators with arrows
4. Handles errors gracefully with fallback values

**Monthly UI Features:**
- **Green Arrow Up** (↗): Indicates increase from previous month
- **Orange Arrow Down** (↘): Indicates decrease from previous month
- **No Arrow**: No change (neutral)
- **Color Coding**: 
  - Increase: Green text (`text-emerald-500`)
  - Decrease: Orange text (`text-orange-500`)
  - Neutral: Muted text (`text-muted-foreground`)

### ActivityProgress Component
Location: `/src/components/activity-progress.tsx`

The `ActivityProgress` component is a server component that displays weekly activity data:
1. Calls `getDashboardStats()` on the server and extracts `weeklyActivity` and `dailyGoal`
2. Shows summary statistics (total workouts and activities for today + last 6 days)
3. Displays daily breakdown with visual progress bars
4. Calculates weekly goal progress

**Weekly UI Features:**
- **Title**: "Today + Last 6 Days" (clarifies the 7-day rolling window)
- **Summary Cards**: Display total workouts and activities for the 7-day period
- **Daily Breakdown**: 
  - Shows 7 days: today + last 6 days (most recent first)
  - Displays day name (e.g., "Mon") and formatted date (e.g., "Oct 21")
  - Shows workout count with gym icon (if > 0)
  - Shows activity count with activity icon (if > 0)
  - Progress bar based on daily activity level (calculated as: (workouts + activities) / dailyGoal * 100%, capped at 100%)
  - "No activity recorded" message for days with no data
- **Weekly Goal Progress**:
  - Goal: Dynamic - based on user's active activity templates (retrieved from `stats.dailyGoal`)
  - Calculation: Average of daily percentages (each day calculated as total/dailyGoal*100, capped at 100%)
  - Progress bar with percentage
  - Dynamic motivational messages based on progress level
  - Example: If user has 2 active activity templates (dailyGoal=2) and daily percentages are [100%, 50%, 100%, 0%, 50%, 100%, 50%], weekly progress = 64%
- **Error Handling**: Displays user-friendly message if data fails to load

## Performance Considerations
- Uses Prisma's `count()` method for efficient counting (monthly stats)
- Uses Prisma's `findMany()` with selective fields for 7-day period data
- Separate queries for current month, previous month, and today + last 6 days
- All queries use indexed fields (`userId`, `date`, `status`)
- Client-side filtering for daily breakdown (minimal overhead with only 7 days)
- Server-side rendering ensures fresh data on each page load

## Data Processing Logic

### Today + Last 6 Days Daily Breakdown
1. **Fetch Data**: Retrieves all workout logs and completed activities for today + last 6 days (7 days total)
2. **Date Range**: Calculates dates from today (i=0) to 6 days ago (i=6)
3. **Grouping**: Loops through each day and filters records by exact date match
4. **Counting**: 
   - Workouts: Counts workout log entries per day
   - Activities: Counts completed daily activities per day
5. **Output**: Returns array of 7 objects in reverse chronological order (today first, 6 days ago last)

### Example Daily Breakdown Output
```typescript
dailyBreakdown: [
  { date: "2025-10-21", workouts: 0, activities: 1 },  // today
  { date: "2025-10-20", workouts: 1, activities: 4 },  // yesterday
  { date: "2025-10-19", workouts: 0, activities: 0 },  // 2 days ago
  { date: "2025-10-18", workouts: 1, activities: 2 },  // 3 days ago
  { date: "2025-10-17", workouts: 2, activities: 1 },  // 4 days ago
  { date: "2025-10-16", workouts: 0, activities: 3 },  // 5 days ago
  { date: "2025-10-15", workouts: 1, activities: 2 }   // 6 days ago
]
```

### Weekly Progress Calculation Example
Using the data above with a user who has 2 active activity templates (dailyGoal = 2):

1. **Calculate each day's percentage:**
   - Day 1 (today): (0+1)/2 * 100 = 50%
   - Day 2 (yesterday): (1+4)/2 * 100 = 250% → capped at 100%
   - Day 3: (0+0)/2 * 100 = 0%
   - Day 4: (1+2)/2 * 100 = 150% → capped at 100%
   - Day 5: (2+1)/2 * 100 = 150% → capped at 100%
   - Day 6: (0+3)/2 * 100 = 150% → capped at 100%
   - Day 7: (1+2)/2 * 100 = 150% → capped at 100%

2. **Average the percentages:**
   - Weekly Progress = (50 + 100 + 0 + 100 + 100 + 100 + 100) / 7
   - Weekly Progress = 550 / 7 = **78.57%** → **79%** (rounded)

**Note:** The dailyGoal is dynamic and adjusts based on the number of active activity templates the user has chosen. If a user has 3 active activity templates, their dailyGoal would be 3, making the calculations accordingly stricter.

This method ensures consistent daily progress measurement and rewards consistency over single-day bursts.

## Future Enhancements
- Add caching for frequently accessed data
- Include week-over-week comparisons
- Add percentage change calculations
- Support custom date ranges
- Add total minutes/duration tracking per day
- Include workout intensity metrics
- Add activity streaks calculation
- Add manual daily goal override (currently auto-calculated from active templates)

