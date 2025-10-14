// Activity types for daily activity tracking

export interface Activity {
  id: string
  name: string
  description: string
  icon: string
}

export interface ActivityProgress {
  activityId: string
  completed: boolean
}

export interface DailyActivityLog {
  id: string
  date: string
  activities: ActivityProgress[]
}

export interface ActivityTemplate extends Activity {
  selected: boolean
}

