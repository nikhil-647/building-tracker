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
      <h4 className="font-medium text-lg">Add Exercises</h4>
      <div className="grid gap-4">
        {selectedMuscleGroups.map((muscleGroupName) => {
          const exercises = allExercises[muscleGroupName] || []
          const MuscleIcon = getMuscleGroupIcon(muscleGroupName)
          
          return (
            <Card key={muscleGroupName}>
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
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
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-start h-auto p-3 ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
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

