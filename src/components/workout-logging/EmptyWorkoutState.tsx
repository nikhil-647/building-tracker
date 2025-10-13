'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'
import { GymIcon, gymIcons } from '@/lib/gym-icons'

interface EmptyWorkoutStateProps {
  onStartWorkout: () => void
  isLoading?: boolean
}

export function EmptyWorkoutState({ onStartWorkout, isLoading }: EmptyWorkoutStateProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">No workouts logged today</p>
        <p className="text-sm">Start your workout to begin logging exercises</p>
      </div>
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="gap-2" 
          onClick={onStartWorkout}
          disabled={isLoading}
        >
          <GymIcon icon={gymIcons.workout} className="h-5 w-5" />
          Start Today&apos;s Workout
        </Button>
      </div>
    </div>
  )
}

