'use client'

import React from 'react'
import type { 
  MuscleGroup, 
  GroupedExercise,
  ExercisesByMuscleGroup
} from '@/types/workout'
import { WorkoutPlanEditor } from '@/components/workout-plan-editor'
import { LogWorkoutToday } from '@/components/log-workout-today'

interface LogWorkoutClientProps {
  muscleGroups: MuscleGroup[]
  userExercisePlan: {
    [key: string]: GroupedExercise[]
  }
  allExercises: ExercisesByMuscleGroup
}

export function LogWorkoutClient({ muscleGroups, userExercisePlan, allExercises }: LogWorkoutClientProps) {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Log Workout</h1>
        <p className="text-neutral-400 text-base">
          Track your daily exercises and log your sets with weight and reps.
        </p>
      </div>

      {/* Workout Plan Editor - Separate Component with its own state */}
      <WorkoutPlanEditor 
        muscleGroups={muscleGroups}
        userExercisePlan={userExercisePlan}
      />

      {/* Log Workouts for Today - Separate Component with its own state */}
      <LogWorkoutToday 
        muscleGroups={muscleGroups}
        allExercises={allExercises}
      />
    </main>
  )
}
