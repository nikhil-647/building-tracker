'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface DailyActivityProgressProps {
  completedActivities: number
  totalActivities: number
  overallProgress: number
}

export function DailyActivityProgress({ 
  completedActivities, 
  totalActivities, 
  overallProgress 
}: DailyActivityProgressProps) {
  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today&apos;s Progress
            </CardTitle>
            <CardDescription className="mt-2">{todayDate}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {completedActivities}/{totalActivities}
            </div>
            <div className="text-sm text-muted-foreground">Activities Completed</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{Math.round(overallProgress)}%</span>
          </div>
          <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

