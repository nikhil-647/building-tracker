import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { saveWorkoutSet, deleteWorkoutSet } from '@/app/api/workout-log/actions'
import type { ExerciseSet, WorkoutSession } from '@/types/workout'

interface UseWorkoutSetsProps {
  currentWorkoutSession: WorkoutSession
  setCurrentWorkoutSession: React.Dispatch<React.SetStateAction<WorkoutSession>>
  selectedExercise: { id: number; name: string; muscleGroup: string } | null
}

/**
 * Manages workout sets with auto-save functionality
 */
export function useWorkoutSets({
  currentWorkoutSession,
  setCurrentWorkoutSession,
  selectedExercise,
}: UseWorkoutSetsProps) {
  const [savingSetIds, setSavingSetIds] = useState<Set<string>>(new Set())
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      debounceTimers.current.forEach(timer => clearTimeout(timer))
    }
  }, [])

  // API call for saving a set
  const saveSetToAPI = useCallback(async (setData: ExerciseSet) => {
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
  }, [currentWorkoutSession.date])

  const updateExerciseSet = useCallback((setId: string, updates: Partial<ExerciseSet>) => {
    // Update local state immediately and capture the updated set
    let updatedSet: ExerciseSet | null = null;
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
    
    // Debounced auto-save.
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
    debounceTimers.current.set(setId, timer);

  }, [saveSetToAPI, setCurrentWorkoutSession])

  const addNewSet = useCallback(() => {
    if (!selectedExercise) return

    const existingSets = currentWorkoutSession.exercises.filter(ex => 
      ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup
    )
    const nextSetNo = existingSets.length + 1

    const newSet: ExerciseSet = {
      id: crypto.randomUUID(),
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
  }, [selectedExercise, currentWorkoutSession.exercises, setCurrentWorkoutSession])

  const removeSet = useCallback(async (setId: string) => {
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
  }, [currentWorkoutSession.exercises, currentWorkoutSession.date, setCurrentWorkoutSession])

  // Get filtered exercise sets for the selected exercise
  const filteredExerciseSets = useMemo(() => {
    if (!selectedExercise) return []
    return currentWorkoutSession.exercises.filter(
      ex => ex.exerciseId === selectedExercise.id && ex.muscleGroup === selectedExercise.muscleGroup
    )
  }, [selectedExercise, currentWorkoutSession.exercises])

  return {
    savingSetIds,
    filteredExerciseSets,
    updateExerciseSet,
    addNewSet,
    removeSet,
  }
}

