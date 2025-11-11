'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, CheckCircle2, Circle, Activity } from 'lucide-react'
import { getActivityIcon } from '../lib/activity-icons'
import type { ActivityTemplate, ActivityProgress } from '@/types/activity'

interface ActivityTrackerProps {
  selectedActivities: ActivityTemplate[]
  progress: ActivityProgress[]
  onToggleComplete: (activityId: string) => void
  isPending?: boolean
}

export function ActivityTracker({ selectedActivities, progress, onToggleComplete, isPending }: ActivityTrackerProps) {
  if (selectedActivities.length === 0) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
              <Activity className="h-8 w-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">No Activities Selected</h3>
              <p className="text-neutral-400">
                Select activities above to start tracking your daily progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5" />
          Track Your Progress
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Mark activities as complete when you finish them
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {selectedActivities.map((activity) => {
            const activityProgress = progress.find(p => p.activityId === activity.id)
            const isCompleted = activityProgress?.completed || false

            return (
              <button
                key={activity.id}
                onClick={() => onToggleComplete(activity.id)}
                disabled={isPending}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all text-left
                  ${isCompleted 
                    ? 'border-white bg-white/5 hover:bg-white/10' 
                    : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800 hover:bg-neutral-750'
                  }
                  ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${isCompleted ? 'bg-white text-neutral-950' : 'bg-neutral-700 text-white'}
                  `}>
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white">{activity.name}</div>
                    <div className="text-sm text-neutral-400 mt-0.5">
                      {activity.description}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : (
                      <Circle className="h-6 w-6 text-neutral-500" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

