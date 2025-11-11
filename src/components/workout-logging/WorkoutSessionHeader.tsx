'use client'

import React from 'react'

interface WorkoutSessionHeaderProps {
  exerciseCount: number
}

export function WorkoutSessionHeader({ exerciseCount }: WorkoutSessionHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg border border-neutral-700">
      <div>
        <h3 className="font-semibold text-lg text-white">Active Workout Session</h3>
        <p className="text-sm text-neutral-400">
          {new Date().toLocaleDateString()} • {exerciseCount} exercises
        </p>
      </div>
    </div>
  )
}

