'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { WorkoutPlanList } from '@/components/workout-plan-list'
import type { MuscleGroup, GroupedExercise } from '@/types/workout'

interface WorkoutPlanEditorProps {
  muscleGroups: MuscleGroup[]
  userExercisePlan: {
    [key: string]: GroupedExercise[]
  }
}

export function WorkoutPlanEditor({ muscleGroups, userExercisePlan }: WorkoutPlanEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Workout Plan Header */}
      <Card 
        className="hover:bg-accent/50 transition-colors cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">My Workout Plan</span>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Workout Plan List - Server Component renders fresh data */}
      {isExpanded && (
        <WorkoutPlanList 
          muscleGroups={muscleGroups}
          userExercisePlan={userExercisePlan}
        />
      )}
    </>
  )
}

