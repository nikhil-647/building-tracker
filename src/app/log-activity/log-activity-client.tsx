'use client'

import React from 'react'
import { DailyActivityProgress } from '@/components/daily-activity-progress'
import { ActivitySelector } from '@/components/activity-selector'
import { ActivityTracker } from '@/components/activity-tracker'
import type { ActivityTemplate, ActivityProgress } from '@/types/activity'
import { useActivityManagement } from '@/hooks/useActivityManagement'

interface LogActivityClientProps {
  activityTemplates: ActivityTemplate[]
  todayProgress: ActivityProgress[]
}

export function LogActivityClient({ 
  activityTemplates: initialTemplates, 
  todayProgress: initialProgress 
}: LogActivityClientProps) {
  const {
    templates,
    progress,
    isPending,
    handleToggleComplete,
    handleAddTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate
  } = useActivityManagement(initialTemplates, initialProgress)

  const totalActivities = templates.length
  const completedActivities = templates.filter(t => {
    const prog = progress.find(p => p.activityId === t.id)
    return prog?.completed
  }).length
  const overallProgress = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Log Daily Activity</h1>
          <p className="text-muted-foreground text-lg">
            Track your daily habits and activities for a healthier lifestyle.
          </p>
        </div>
      </div>

      {/* Daily Activity Progress - Sticky/Floating Component */}
      <div className="sticky top-16 z-10 bg-background pb-2">
        <DailyActivityProgress
          completedActivities={completedActivities}
          totalActivities={totalActivities}
          overallProgress={overallProgress}
        />
      </div>

      {/* Activity Selector - Separate Component with its own state */}
      <ActivitySelector 
        templates={templates}
        onAddTemplate={handleAddTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        isPending={isPending}
      />

      {/* Activity Tracker - Separate Component with its own state */}
      <ActivityTracker
        selectedActivities={templates}
        progress={progress}
        onToggleComplete={handleToggleComplete}
        isPending={isPending}
      />
    </main>
  )
}
