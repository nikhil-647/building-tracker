import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/navbar'
import { LogActivityClient } from './log-activity-client'
import type { ActivityTemplate, ActivityProgress } from '@/types/activity'

// Mock data for activity templates
const mockActivityTemplates: ActivityTemplate[] = [
  {
    id: '1',
    name: '10K Steps',
    description: 'Walk 10,000 steps today',
    icon: 'footprints',
    selected: false
  },
  {
    id: '2',
    name: '8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    icon: 'droplets',
    selected: false
  },
  {
    id: '3',
    name: '7 Hours Sleep',
    description: 'Get quality rest tonight',
    icon: 'moon',
    selected: false
  },
  {
    id: '4',
    name: '30 Minutes Reading',
    description: 'Read for personal development',
    icon: 'book',
    selected: false
  },
  {
    id: '5',
    name: '5 Servings Fruits/Veg',
    description: 'Eat healthy throughout the day',
    icon: 'apple',
    selected: false
  },
  {
    id: '6',
    name: '15 Minutes Meditation',
    description: 'Practice mindfulness',
    icon: 'sparkles',
    selected: false
  },
  {
    id: '7',
    name: '3 Healthy Meals',
    description: 'Eat balanced meals today',
    icon: 'utensils',
    selected: false
  },
  {
    id: '8',
    name: '60 Minutes Exercise',
    description: 'Complete your workout routine',
    icon: 'dumbbell',
    selected: false
  },
  {
    id: '9',
    name: '2 Liters Water',
    description: 'Track water intake in liters',
    icon: 'droplets',
    selected: false
  },
  {
    id: '10',
    name: 'Take Vitamins',
    description: 'Take daily vitamin supplements',
    icon: 'pill',
    selected: false
  },
  {
    id: '11',
    name: '30 Minutes Cardio',
    description: 'Running or cycling session',
    icon: 'zap-cardio',
    selected: false
  },
  {
    id: '12',
    name: 'Morning Coffee',
    description: 'Enjoy your morning coffee',
    icon: 'coffee',
    selected: false
  }
]

// Mock data for today's progress (empty by default)
const mockTodayProgress: ActivityProgress[] = []

export default async function LogActivity() {
  // Check authentication on server
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <LogActivityClient 
        activityTemplates={mockActivityTemplates}
        todayProgress={mockTodayProgress}
      />
    </div>
  )
}

