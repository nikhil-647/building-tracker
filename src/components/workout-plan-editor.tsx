'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Trash2, 
  Dumbbell, 
  ChevronDown, 
  ChevronRight
} from 'lucide-react'
import { AddExerciseModal } from '@/components/add-exercise-modal'
import type { 
  MuscleGroup, 
  Exercise, 
  WorkoutPlan, 
  GroupedExercise
} from '@/types/workout'

// Color styling for muscle groups
const muscleGroupColor = 'bg-green-50 text-green-800 border-green-200'

interface WorkoutPlanEditorProps {
  muscleGroups: MuscleGroup[]
  userExercisePlan: {
    [key: string]: GroupedExercise[]
  }
}

export function WorkoutPlanEditor({ muscleGroups, userExercisePlan }: WorkoutPlanEditorProps) {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>({
    id: 1,
    muscleGroups: userExercisePlan
  })
  const [expandedMuscleGroups, setExpandedMuscleGroups] = useState<Set<string>>(new Set(['Chest', 'Back']))
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleMuscleGroup = (muscleGroup: string) => {
    const newExpanded = new Set(expandedMuscleGroups)
    if (newExpanded.has(muscleGroup)) {
      newExpanded.delete(muscleGroup)
    } else {
      newExpanded.add(muscleGroup)
    }
    setExpandedMuscleGroups(newExpanded)
  }

  const addExerciseToMuscleGroup = (exerciseName: string, muscleGroup: string) => {
    const newExercise: Exercise = {
      id: Date.now(),
      name: exerciseName,
      image: null
    }

    setWorkoutPlan(prev => ({
      ...prev,
      muscleGroups: {
        ...prev.muscleGroups,
        [muscleGroup]: [...(prev.muscleGroups[muscleGroup] || []), newExercise]
      }
    }))
  }

  const removeExerciseFromMuscleGroup = (muscleGroup: string, exerciseId: number) => {
    setWorkoutPlan(prev => ({
      ...prev,
      muscleGroups: {
        ...prev.muscleGroups,
        [muscleGroup]: prev.muscleGroups[muscleGroup]?.filter(ex => ex.id !== exerciseId) || []
      }
    }))
  }

  return (
    <>
      {/* Workout Plan Header */}
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
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

      {/* Workout Plan Editor */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle>Muscle Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {muscleGroups.map((muscleGroup) => {
                const exercises = workoutPlan.muscleGroups[muscleGroup.name] || []
                const isMuscleGroupExpanded = expandedMuscleGroups.has(muscleGroup.name)
                
                return (
                  <Card key={muscleGroup.id} className="overflow-hidden hover:bg-accent/50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between cursor-pointer" onClick={() => toggleMuscleGroup(muscleGroup.name)}>
                        <div className="flex items-center gap-3">
                          {isMuscleGroupExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${muscleGroupColor}`}>
                            {muscleGroup.name}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsAddExerciseModalOpen(true)
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Exercise
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    
                    {isMuscleGroupExpanded && (
                      <CardContent className="pt-0">
                        {/* Exercise List */}
                        <div className="space-y-2">
                          {exercises.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No exercises added yet</p>
                              <p className="text-sm">Click "Add Exercise" to get started</p>
                            </div>
                          ) : (
                            exercises.map((exercise) => (
                              <div 
                                key={exercise.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{exercise.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExerciseFromMuscleGroup(muscleGroup.name, exercise.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onSave={addExerciseToMuscleGroup}
      />
    </>
  )
}

