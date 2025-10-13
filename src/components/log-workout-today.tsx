'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Loader2 } from 'lucide-react'
import type { 
  MuscleGroup, 
  ExercisesByMuscleGroup
} from '@/types/workout'
import { useWorkoutSession } from '@/hooks/useWorkoutSession'
import { useWorkoutSelection } from '@/hooks/useWorkoutSelection'
import { useWorkoutSets } from '@/hooks/useWorkoutSets'
import { EmptyWorkoutState } from '@/components/workout-logging/EmptyWorkoutState'
import { WorkoutSessionHeader } from '@/components/workout-logging/WorkoutSessionHeader'
import { MuscleGroupSelector } from '@/components/workout-logging/MuscleGroupSelector'
import { ExerciseSelector } from '@/components/workout-logging/ExerciseSelector'
import { SetLogger } from '@/components/workout-logging/SetLogger'

interface LogWorkoutTodayProps {
  muscleGroups: MuscleGroup[]
  allExercises: ExercisesByMuscleGroup
}

export function LogWorkoutToday({ muscleGroups, allExercises }: LogWorkoutTodayProps) {
  // Session management (loading, starting workout)
  const {
    isWorkoutActive,
    isLoadingWorkout,
    currentWorkoutSession,
    setCurrentWorkoutSession,
    startWorkout,
  } = useWorkoutSession()

  // Selection management (muscle groups, exercises)
  const {
    selectedMuscleGroups,
    selectedExercise,
    toggleMuscleGroupSelection,
    selectExercise,
  } = useWorkoutSelection()

  // Sets management (add, update, delete with auto-save)
  const {
    savingSetIds,
    filteredExerciseSets,
    updateExerciseSet,
    addNewSet,
    removeSet,
  } = useWorkoutSets({
    currentWorkoutSession,
    setCurrentWorkoutSession,
    selectedExercise,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Log Workouts for Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingWorkout && !isWorkoutActive ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading workout data...</p>
          </div>
        ) : !isWorkoutActive ? (
          <EmptyWorkoutState 
            onStartWorkout={startWorkout}
            isLoading={isLoadingWorkout}
          />
        ) : (
          <div className="space-y-6">
            <WorkoutSessionHeader exerciseCount={currentWorkoutSession.exercises.length} />

            <MuscleGroupSelector
              muscleGroups={muscleGroups}
              selectedMuscleGroups={selectedMuscleGroups}
              onToggleMuscleGroup={toggleMuscleGroupSelection}
            />

            <ExerciseSelector
              selectedMuscleGroups={selectedMuscleGroups}
              allExercises={allExercises}
              selectedExercise={selectedExercise}
              onSelectExercise={selectExercise}
            />

            <SetLogger
              selectedExercise={selectedExercise}
              exerciseSets={filteredExerciseSets}
              savingSetIds={savingSetIds}
              onAddNewSet={addNewSet}
              onUpdateSet={updateExerciseSet}
              onRemoveSet={removeSet}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

