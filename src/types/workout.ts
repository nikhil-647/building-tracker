/**
 * Workout Types
 * 
 * Shared TypeScript interfaces and types for the workout tracking system
 */

export interface MuscleGroup {
  id: number
  name: string
}

export interface Exercise {
  id: number
  name: string
  image: string | null
  muscleGroupId?: number
}

export interface WorkoutPlan {
  id: number
  muscleGroups: {
    [key: string]: GroupedExercise[]
  }
}

export interface ExerciseSet {
  id: string
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  setNo: number
  weight: number | null
  reps: number | null
  completed: boolean
}

export interface WorkoutSession {
  id: string
  date: string
  muscleGroups: string[]
  exercises: ExerciseSet[]
}

export interface GroupedExercise {
  id: number
  name: string
  image: string | null
  planId: number
}

export interface ExercisesByMuscleGroup {
  [muscleGroup: string]: Exercise[]
}

