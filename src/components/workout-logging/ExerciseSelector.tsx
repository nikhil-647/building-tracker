'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getMuscleGroupIcon, GymIcon } from '@/lib/gym-icons'
import type { Exercise, ExercisesByMuscleGroup } from '@/types/workout'

interface ExerciseSelectorProps {
  selectedMuscleGroups: string[]
  allExercises: ExercisesByMuscleGroup
  selectedExercise: { id: number; name: string; muscleGroup: string } | null
  onSelectExercise: (exercise: Exercise, muscleGroup: string) => void
}

export function ExerciseSelector({ 
  selectedMuscleGroups, 
  allExercises, 
  selectedExercise,
  onSelectExercise 
}: ExerciseSelectorProps) {
  if (selectedMuscleGroups.length === 0) {
    return null
  }

  return (
    <div id="add-exercises-section" className="space-y-4 scroll-mt-4">
      <h4 className="font-medium text-lg text-white">Add Exercises</h4>
      <div className="grid gap-4">
        {selectedMuscleGroups.map((muscleGroupName) => {
          const exercises = allExercises[muscleGroupName] || []
          const MuscleIcon = getMuscleGroupIcon(muscleGroupName)
          
          return (
            <Card key={muscleGroupName} className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <GymIcon icon={MuscleIcon} className="h-5 w-5" />
                  {muscleGroupName} Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exercises.map((exercise) => {
                    const isSelected = selectedExercise?.id === exercise.id && selectedExercise?.muscleGroup === muscleGroupName
                    return (
                      <Button
                        key={exercise.id}
                        variant="outline"
                        className={`justify-start h-auto p-3 transition-all ${
                          isSelected 
                            ? 'bg-white text-neutral-950 hover:bg-neutral-200 border-white' 
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600 hover:text-white'
                        }`}
                        onClick={() => onSelectExercise(exercise, muscleGroupName)}
                      >
                        <GymIcon icon={MuscleIcon} className="h-4 w-4 mr-2" />
                        {exercise.name}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

