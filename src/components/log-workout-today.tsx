'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  Loader2
} from 'lucide-react'
import { getMuscleGroupIcon, GymIcon, gymIcons } from '@/lib/gym-icons'
import { saveWorkoutSet, deleteWorkoutSet, getWorkoutLogsByDate } from '@/app/api/workout-log/actions'
import { toast } from 'sonner'
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
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<{id: number, name: string, muscleGroup: string} | null>(null)
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState<WorkoutSession>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    muscleGroups: [],
    exercises: []
  })
  
  // Auto-save state
  const [savingSetIds, setSavingSetIds] = useState<Set<string>>(new Set())
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())
  
  // API call for saving a set
  const saveSetToAPI = async (setData: ExerciseSet) => {
    try {
      const result = await saveWorkoutSet(
        setData.exerciseId,
        setData.muscleGroup,
        setData.setNo,
        setData.weight,
        setData.reps,
        currentWorkoutSession.date
      )
      
      if (!result.success) {
        toast.error(result.error || 'Failed to save workout set')
        console.error('Error saving set:', result.error)
      }
    } catch (error) {
      console.error('Error saving set to API:', error)
      toast.error('Failed to save workout set')
    }
  }

  const startWorkout = () => {
    // Simple start for fresh workout (initial load is handled by useEffect)
    const todayDate = new Date().toISOString().split('T')[0]
    setCurrentWorkoutSession({
      id: `workout-${Date.now()}`,
      date: todayDate,
      muscleGroups: [],
      exercises: []
    })
    setIsWorkoutActive(true)
  }

  const toggleMuscleGroupSelection = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => {
      // If clicking the same muscle group, deselect it
      if (prev.includes(muscleGroup)) {
        setSelectedExercise(null)
        return []
      }
      
      // Otherwise, select only this muscle group (single selection)
      const newSelection = [muscleGroup]
      
      // Clear selected exercise when switching muscle groups
      setSelectedExercise(null)
      
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
    // Set the selected exercise (don't auto-add a set)
    setSelectedExercise({
      id: exercise.id,
      name: exercise.name,
      muscleGroup
    })

    // Smooth scroll to the Log Your Sets section after selecting exercise
    setTimeout(() => {
      const logSection = document.getElementById('log-sets-section')
      if (logSection) {
        logSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const updateExerciseSet = (setId: string, updates: Partial<ExerciseSet>) => {
    // Update local state immediately and capture the updated set
    let updatedSet: ExerciseSet | null = null
    
    setCurrentWorkoutSession(prev => {
      const newExercises = prev.exercises.map(exercise => {
        if (exercise.id === setId) {
          updatedSet = { ...exercise, ...updates }
          return updatedSet
        }
        return exercise
      })
      
      return {
        ...prev,
        exercises: newExercises
      }
    })
    
    // Debounced auto-save
    const existingTimer = debounceTimers.current.get(setId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }
    
    // Set saving state
    setSavingSetIds(prev => new Set(prev).add(setId))
    
    // Create new debounced save with the captured updated set
    const timer = setTimeout(async () => {
      if (updatedSet) {
        await saveSetToAPI(updatedSet)
        setSavingSetIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(setId)
          return newSet
        })
      }
      debounceTimers.current.delete(setId)
    }, 1000) // 1 second debounce
    
    debounceTimers.current.set(setId, timer)
  }
  
  // Load existing workouts on mount
  useEffect(() => {
    const loadExistingWorkouts = async () => {
      setIsLoadingWorkout(true)
      const todayDate = new Date().toISOString().split('T')[0]
      
      try {
        const result = await getWorkoutLogsByDate(todayDate)
        
        if (result.success && result.data.length > 0) {
          // Auto-activate workout and load existing data
          setCurrentWorkoutSession({
            id: `workout-${Date.now()}`,
            date: todayDate,
            muscleGroups: [],
            exercises: result.data
          })
          setIsWorkoutActive(true)
        }
      } catch (error) {
        console.error('Error loading existing workouts:', error)
      } finally {
        setIsLoadingWorkout(false)
      }
    }
    
    loadExistingWorkouts()
  }, [])
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      debounceTimers.current.forEach(timer => clearTimeout(timer))
    }
  }, [])

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

  const removeSet = async (setId: string) => {
    // Find the set to be removed
    const setToRemove = currentWorkoutSession.exercises.find(ex => ex.id === setId)
    
    if (!setToRemove) return
    
    // Optimistically remove from UI first
    setCurrentWorkoutSession(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== setId)
    }))
    
    // Call API to delete from database
    try {
      const result = await deleteWorkoutSet(
        setToRemove.exerciseId,
        setToRemove.muscleGroup,
        setToRemove.setNo,
        currentWorkoutSession.date
      )
      
      if (!result.success) {
        toast.error(result.error || 'Failed to delete workout set')
        // Restore the set if deletion failed
        setCurrentWorkoutSession(prev => ({
          ...prev,
          exercises: [...prev.exercises, setToRemove].sort((a, b) => a.setNo - b.setNo)
        }))
      }
    } catch (error) {
      console.error('Error deleting set:', error)
      toast.error('Failed to delete workout set')
      // Restore the set if deletion failed
      setCurrentWorkoutSession(prev => ({
        ...prev,
        exercises: [...prev.exercises, setToRemove].sort((a, b) => a.setNo - b.setNo)
      }))
    }
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
        {isLoadingWorkout && !isWorkoutActive ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading workout data...</p>
          </div>
        ) : !isWorkoutActive ? (
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
                onClick={startWorkout}
                disabled={isLoadingWorkout}
              >
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
                          .length > 0 ? (
                          <>
                            {currentWorkoutSession.exercises
                              .filter(ex => ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup)
                              .map((set) => (
                                <div 
                                  key={set.id} 
                                  className="p-4 border rounded-lg transition-all bg-card"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      Set {set.setNo}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {savingSetIds.has(set.id) && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          <span>Saving...</span>
                                        </div>
                                      )}
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
                          </>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <p className="text-sm">Click &quot;+ Add Set&quot; to start logging sets for this exercise</p>
                          </div>
                        )}
                        
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

