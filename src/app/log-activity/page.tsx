import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { LogActivityClient } from './log-activity-client'
import type { ActivityTemplate, ActivityProgress } from '@/types/activity'
import { ActivityStatusEnum } from '@prisma/client'

export default async function LogActivity() {
  // Check authentication on server
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { email: session.user.email! }
  })

  if (!user) {
    redirect('/login')
  }

  // Get today's date (start of day in local timezone)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Fetch all active activity templates for this user
  const activityTemplates = await db.activityTemplate.findMany({
    where: {
      userId: user.id,
      isActive: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Fetch today's activity progress
  const todayProgress = await db.dailyActivity.findMany({
    where: {
      userId: user.id,
      date: today
    }
  })

  // Transform data to match frontend types
  const templates: ActivityTemplate[] = activityTemplates.map((t) => ({
    id: t.id.toString(),
    name: t.name,
    description: t.description,
    icon: t.icon,
    selected: false
  }))

  const progress: ActivityProgress[] = todayProgress.map((p) => ({
    activityId: p.templateId.toString(),
    completed: p.status === ActivityStatusEnum.completed
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <LogActivityClient 
        activityTemplates={templates}
        todayProgress={progress}
      />
    </div>
  )
}

