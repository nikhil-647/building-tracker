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
}

export function ActivityTracker({ selectedActivities, progress, onToggleComplete }: ActivityTrackerProps) {
  if (selectedActivities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Activities Selected</h3>
              <p className="text-muted-foreground">
                Select activities above to start tracking your daily progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Track Your Progress
        </CardTitle>
        <CardDescription>
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
                className={`
                  w-full p-4 rounded-lg border-2 transition-all text-left
                  ${isCompleted 
                    ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                    : 'border-border hover:border-primary/50 bg-card hover:bg-accent/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}
                  `}>
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{activity.name}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {activity.description}
                    </div>
                    {isCompleted && (
                      <div className="mt-1">
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
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

