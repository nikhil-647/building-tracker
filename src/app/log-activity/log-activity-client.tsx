'use client'

import React from 'react'
import { DailyActivityProgress } from '@/components/daily-activity-progress'
import { ActivitySelector } from '@/components/activity-selector'
import { ActivityTracker } from '@/components/activity-tracker'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
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
    <>
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6 max-w-7xl">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Log Daily Activity</h1>
          <p className="text-neutral-400 text-base">
            Track your daily habits and build consistency.
          </p>
        </div>

        {/* Daily Activity Progress - Sticky/Floating Component */}
        <div className="sticky top-16 md:top-16 z-10 bg-neutral-950 pb-2">
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

      <MobileBottomNav />
    </>
  )
}
