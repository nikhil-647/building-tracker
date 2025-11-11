import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { LogActivityClient } from './log-activity-client'
import type { ActivityTemplate, ActivityProgress } from '@/types/activity'
import { ActivityStatusEnum } from '@prisma/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default async function LogActivity() {
  // Check authentication on server
  const session = await auth()

  // Redirect to homepage if not authenticated
  if (!session?.user) {
    redirect('/')
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { email: session.user.email! }
  })

  if (!user) {
    redirect('/')
  }

  // Get today's date at UTC midnight to match database storage
  const todayDate = dayjs.utc().startOf('day').toDate()

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
      date: todayDate
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
    <div className="min-h-screen bg-neutral-950">
      <Navbar user={session.user} />
      <LogActivityClient 
        activityTemplates={templates}
        todayProgress={progress}
      />
    </div>
  )
}

