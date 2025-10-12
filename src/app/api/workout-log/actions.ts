'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { MuscleGroupEnum } from '@prisma/client'

/**
 * Save or update a workout log entry
 * Each set is saved as a separate row in WorkoutLog table
 */
export async function saveWorkoutSet(
  exerciseId: number,
  muscleGroupName: string,
  setNo: number,
  weight: number | null,
  reps: number | null,
  date: string
) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Get muscle group ID from name
    const muscleGroup = await db.muscleGroup.findUnique({
      where: { name: muscleGroupName as MuscleGroupEnum }
    })

    if (!muscleGroup) {
      return { success: false, error: 'Muscle group not found' }
    }

    // Find or create the exercise plan for this user+exercise+muscleGroup
    let exercisePlan = await db.exercisePlan.findFirst({
      where: {
        userId: user.id,
        exerciseId: exerciseId,
        exerciseGroupId: muscleGroup.id
      }
    })

    // If no exercise plan exists, create one
    if (!exercisePlan) {
      exercisePlan = await db.exercisePlan.create({
        data: {
          userId: user.id,
          exerciseId: exerciseId,
          exerciseGroupId: muscleGroup.id
        }
      })
    }

    // Convert date string to Date object
    const workoutDate = new Date(date)

    // Upsert the workout log (update if exists, create if not)
    const workoutLog = await db.workoutLog.upsert({
      where: {
        templateId_setNo_userId_date: {
          templateId: exercisePlan.id,
          setNo: setNo,
          userId: user.id,
          date: workoutDate
        }
      },
      update: {
        weight: weight,
        reps: reps
      },
      create: {
        templateId: exercisePlan.id,
        setNo: setNo,
        weight: weight,
        reps: reps,
        userId: user.id,
        date: workoutDate
      }
    })

    return { 
      success: true, 
      data: {
        id: workoutLog.id,
        templateId: workoutLog.templateId,
        setNo: workoutLog.setNo,
        weight: workoutLog.weight,
        reps: workoutLog.reps
      }
    }
  } catch (error: unknown) {
    console.error('Error saving workout set:', error)
    
    // Handle foreign key constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return { success: false, error: 'Invalid exercise or muscle group' }
    }
    
    return { success: false, error: 'Failed to save workout set' }
  }
}

/**
 * Delete a workout log entry
 */
export async function deleteWorkoutSet(
  exerciseId: number,
  muscleGroupName: string,
  setNo: number,
  date: string
) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Get muscle group ID from name
    const muscleGroup = await db.muscleGroup.findUnique({
      where: { name: muscleGroupName as MuscleGroupEnum }
    })

    if (!muscleGroup) {
      return { success: false, error: 'Muscle group not found' }
    }

    // Find the exercise plan
    const exercisePlan = await db.exercisePlan.findFirst({
      where: {
        userId: user.id,
        exerciseId: exerciseId,
        exerciseGroupId: muscleGroup.id
      }
    })

    if (!exercisePlan) {
      return { success: false, error: 'Exercise plan not found' }
    }

    // Convert date string to Date object
    const workoutDate = new Date(date)

    // Delete the workout log entry
    await db.workoutLog.delete({
      where: {
        templateId_setNo_userId_date: {
          templateId: exercisePlan.id,
          setNo: setNo,
          userId: user.id,
          date: workoutDate
        }
      }
    })

    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting workout set:', error)
    
    // Handle record not found
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return { success: false, error: 'Workout set not found' }
    }
    
    return { success: false, error: 'Failed to delete workout set' }
  }
}

/**
 * Get workout logs for a specific date
 */
export async function getWorkoutLogsByDate(date: string) {
  try {
    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated', data: [] }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return { success: false, error: 'User not found', data: [] }
    }

    // Convert date string to Date object
    const workoutDate = new Date(date)

    // Fetch workout logs for this date
    const workoutLogs = await db.workoutLog.findMany({
      where: {
        userId: user.id,
        date: workoutDate
      },
      include: {
        exercisePlan: {
          include: {
            exercise: true,
            muscleGroup: true
          }
        }
      },
      orderBy: [
        { exercisePlan: { exerciseGroupId: 'asc' } },
        { exercisePlan: { exerciseId: 'asc' } },
        { setNo: 'asc' }
      ]
    })

    // Transform the data to match the frontend format
    const transformedLogs = workoutLogs.map(log => ({
      id: `set-${log.id}`,
      exerciseId: log.exercisePlan.exercise.id,
      exerciseName: log.exercisePlan.exercise.exerciseName,
      muscleGroup: log.exercisePlan.muscleGroup.name,
      setNo: log.setNo,
      weight: log.weight,
      reps: log.reps,
      completed: true
    }))

    return { success: true, data: transformedLogs }
  } catch (error) {
    console.error('Error fetching workout logs:', error)
    return { success: false, error: 'Failed to fetch workout logs', data: [] }
  }
}

