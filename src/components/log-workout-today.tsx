'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  Check,
  X
} from 'lucide-react'
import { getMuscleGroupIcon, GymIcon, gymIcons } from '@/lib/gym-icons'
import type { 
  MuscleGroup, 
  Exercise, 
  ExerciseSet, 
  WorkoutSession,
  ExercisesByMuscleGroup
} from '@/types/workout'

interface LogWorkoutTodayProps {
  muscleGroups: MuscleGroup[]
  allExercises: ExercisesByMuscleGroup
}

export function LogWorkoutToday({ muscleGroups, allExercises }: LogWorkoutTodayProps) {
  // Workout logging state
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<{id: number, name: string, muscleGroup: string} | null>(null)
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState<WorkoutSession>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    muscleGroups: [],
    exercises: []
  })

  const startWorkout = () => {
    setIsWorkoutActive(true)
    setCurrentWorkoutSession(prev => ({
      ...prev,
      id: `workout-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    }))
  }

  const toggleMuscleGroupSelection = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => {
      // If clicking the same muscle group, deselect it
      if (prev.includes(muscleGroup)) {
        return []
      }
      
      // Otherwise, select only this muscle group (single selection)
      const newSelection = [muscleGroup]
      
      // Smooth scroll to Add Exercises section when muscle group is selected
      setTimeout(() => {
        const addExercisesSection = document.getElementById('add-exercises-section')
        if (addExercisesSection) {
          addExercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      
      return newSelection
    })
  }

  const selectExercise = (exercise: Exercise, muscleGroup: string) => {
    // Set the selected exercise
    setSelectedExercise({
      id: exercise.id,
      name: exercise.name,
      muscleGroup
    })

    // Add the first set for this exercise
    const newSet: ExerciseSet = {
      id: `set-${Date.now()}-${Math.random()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup,
      setNo: 1,
      weight: null,
      reps: null,
      completed: false
    }

    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, newSet]
    }))

    // Smooth scroll to the Log Your Sets section after selecting exercise
    setTimeout(() => {
      const logSection = document.getElementById('log-sets-section')
      if (logSection) {
        logSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const updateExerciseSet = (setId: string, updates: Partial<ExerciseSet>) => {
    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === setId ? { ...exercise, ...updates } : exercise
      )
    }))
  }

  const addNewSet = () => {
    if (!selectedExercise) return

    const existingSets = currentWorkoutSession.exercises.filter(ex => 
      ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup
    )
    const nextSetNo = existingSets.length + 1

    const newSet: ExerciseSet = {
      id: `set-${Date.now()}-${Math.random()}`,
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      muscleGroup: selectedExercise.muscleGroup,
      setNo: nextSetNo,
      weight: null,
      reps: null,
      completed: false
    }

    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, newSet]
    }))

    // Smooth scroll to the new set after a brief delay
    setTimeout(() => {
      const logSection = document.getElementById('log-sets-section')
      if (logSection) {
        logSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 100)
  }

  const removeSet = (setId: string) => {
    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== setId)
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Log Workouts for Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isWorkoutActive ? (
          <div className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No workouts logged today</p>
              <p className="text-sm">Start your workout to begin logging exercises</p>
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="gap-2" onClick={startWorkout}>
                <GymIcon icon={gymIcons.workout} className="h-5 w-5" />
                Start Today&apos;s Workout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Workout Session Header */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border">
              <div>
                <h3 className="font-semibold text-lg">Active Workout Session</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()} • {currentWorkoutSession.exercises.length} exercises
                </p>
              </div>
            </div>

            {/* Muscle Group Selection */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Select Muscle Group</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {muscleGroups.map((muscleGroup) => {
                  const MuscleIcon = getMuscleGroupIcon(muscleGroup.name)
                  return (
                    <Button
                      key={muscleGroup.id}
                      variant={selectedMuscleGroups.includes(muscleGroup.name) ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${
                        selectedMuscleGroups.includes(muscleGroup.name) 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                      }`}
                      onClick={() => toggleMuscleGroupSelection(muscleGroup.name)}
                    >
                      <GymIcon icon={MuscleIcon} className="h-5 w-5" />
                      <span className="text-sm font-medium">{muscleGroup.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Exercise Selection */}
            {selectedMuscleGroups.length > 0 && (
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
                                  onClick={() => selectExercise(exercise, muscleGroupName)}
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
            )}

            {/* Exercise Sets Logging */}
            {selectedExercise && (
              <div id="log-sets-section" className="space-y-4 scroll-mt-4">
                <h4 className="font-medium text-lg">Log Your Sets</h4>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedExercise.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedExercise.muscleGroup}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentWorkoutSession.exercises
                          .filter(ex => ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup)
                          .map((set) => (
                            <div key={set.id} className="p-4 border rounded-lg bg-card">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-muted-foreground">Set {set.setNo}</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant={set.completed ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateExerciseSet(set.id, { completed: !set.completed })}
                                  >
                                    {set.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSet(set.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`weight-${set.id}`} className="text-sm font-medium">Weight (lbs)</Label>
                                  <Input
                                    id={`weight-${set.id}`}
                                    type="number"
                                    placeholder="0"
                                    value={set.weight || ''}
                                    onChange={(e) => updateExerciseSet(set.id, { 
                                      weight: e.target.value ? parseFloat(e.target.value) : null 
                                    })}
                                    className="w-full"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`reps-${set.id}`} className="text-sm font-medium">Reps</Label>
                                  <Input
                                    id={`reps-${set.id}`}
                                    type="number"
                                    placeholder="0"
                                    value={set.reps || ''}
                                    onChange={(e) => updateExerciseSet(set.id, { 
                                      reps: e.target.value ? parseInt(e.target.value) : null 
                                    })}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addNewSet}
                          className="w-full gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Set
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

