import { useState, useCallback } from 'react'
import type { Exercise } from '@/types/workout'

/**
 * Manages muscle group and exercise selection with smooth scrolling
 */
export function useWorkoutSelection() {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState<{
    id: number
    name: string
    muscleGroup: string
  } | null>(null)

  const toggleMuscleGroupSelection = useCallback((muscleGroup: string) => {
    setSelectedMuscleGroups(prev => {
      // If clicking the same muscle group, do nothing
      if (prev.includes(muscleGroup)) {
        return prev
      }
      
      // Select this muscle group and clear selected exercise when switching
      setSelectedExercise(null)
      
      // Smooth scroll to Add Exercises section when muscle group is selected
      setTimeout(() => {
        const addExercisesSection = document.getElementById('add-exercises-section')
        if (addExercisesSection) {
          addExercisesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      
      return [muscleGroup]
    })
  }, [])

  const selectExercise = useCallback((exercise: Exercise, muscleGroup: string) => {
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
  }, [])

  return {
    selectedMuscleGroups,
    selectedExercise,
    toggleMuscleGroupSelection,
    selectExercise,
  }
}

