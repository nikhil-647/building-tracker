'use client'

import React from 'react'

interface WorkoutSessionHeaderProps {
  exerciseCount: number
}

export function WorkoutSessionHeader({ exerciseCount }: WorkoutSessionHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border">
      <div>
        <h3 className="font-semibold text-lg">Active Workout Session</h3>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString()} • {exerciseCount} exercises
        </p>
      </div>
    </div>
  )
}

