import { useState, useEffect } from 'react'
import { getWorkoutLogsByDate } from '@/app/api/workout-log/actions'
import type { WorkoutSession } from '@/types/workout'

/**
 * Manages the workout session state and loads existing workout data
 */
export function useWorkoutSession() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false)
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState<WorkoutSession>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    muscleGroups: [],
    exercises: []
  })

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
            id: crypto.randomUUID(),
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

  const startWorkout = () => {
    const todayDate = new Date().toISOString().split('T')[0]
    setCurrentWorkoutSession({
      id: crypto.randomUUID(),
      date: todayDate,
      muscleGroups: [],
      exercises: []
    })
    setIsWorkoutActive(true)
  }

  return {
    isWorkoutActive,
    isLoadingWorkout,
    currentWorkoutSession,
    setCurrentWorkoutSession,
    startWorkout,
  }
}

