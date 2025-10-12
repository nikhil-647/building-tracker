'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { MuscleGroupEnum } from '@prisma/client'

/**
 * Add an exercise to user's workout plan
 */
export async function addExerciseToUserPlan(exerciseId: number, muscleGroupName: string) {
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

    // Check if exercise exists
    const exercise = await db.exercise.findUnique({
      where: { id: exerciseId }
    })

    if (!exercise) {
      return { success: false, error: 'Exercise not found' }
    }

    // Add to user's exercise plan (will fail if already exists due to unique constraint)
    const exercisePlan = await db.exercisePlan.create({
      data: {
        userId: user.id,
        exerciseId: exerciseId,
        exerciseGroupId: muscleGroup.id
      },
      include: {
        exercise: true,
        muscleGroup: true
      }
    })

    // Revalidate the log-workout page to show updated data
    revalidatePath('/log-workout')

    return { 
      success: true, 
      data: {
        planId: exercisePlan.id,
        exerciseId: exercisePlan.exercise.id,
        exerciseName: exercisePlan.exercise.exerciseName,
        muscleGroupName: exercisePlan.muscleGroup.name
      }
    }
  } catch (error: any) {
    console.error('Error adding exercise to plan:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return { success: false, error: 'This exercise is already in your plan for this muscle group' }
    }
    
    return { success: false, error: 'Failed to add exercise to plan' }
  }
}

/**
 * Delete an exercise from user's workout plan
 */
export async function deleteExerciseFromUserPlan(planId: number) {
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

    // Verify the exercise plan belongs to the user before deleting
    const exercisePlan = await db.exercisePlan.findUnique({
      where: { id: planId },
      include: {
        exercise: true,
        muscleGroup: true
      }
    })

    if (!exercisePlan) {
      return { success: false, error: 'Exercise plan not found' }
    }

    if (exercisePlan.userId !== user.id) {
      return { success: false, error: 'Unauthorized to delete this exercise' }
    }

    // Delete the exercise plan
    await db.exercisePlan.delete({
      where: { id: planId }
    })

    // Revalidate the log-workout page to show updated data
    revalidatePath('/log-workout')

    return { 
      success: true, 
      message: `${exercisePlan.exercise.exerciseName} removed from ${exercisePlan.muscleGroup.name}` 
    }
  } catch (error) {
    console.error('Error deleting exercise from plan:', error)
    return { success: false, error: 'Failed to delete exercise from plan' }
  }
}

/**
 * Get available exercises for a muscle group (excluding already added ones)
 */
export async function getAvailableExercises(muscleGroupName: string) {
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

    // Get muscle group ID from name
    const muscleGroup = await db.muscleGroup.findUnique({
      where: { name: muscleGroupName as MuscleGroupEnum }
    })

    if (!muscleGroup) {
      return { success: false, error: 'Muscle group not found', data: [] }
    }

    // Get all exercises for this muscle group
    const allExercises = await db.exercise.findMany({
      where: { muscleGroupId: muscleGroup.id },
      orderBy: { exerciseName: 'asc' }
    })

    // Get user's existing exercise plan for this muscle group
    const userExercisePlan = await db.exercisePlan.findMany({
      where: {
        userId: user.id,
        exerciseGroupId: muscleGroup.id
      },
      select: {
        exerciseId: true
      }
    })

    // Create a set of exercise IDs that user already has
    const existingExerciseIds = new Set(userExercisePlan.map(plan => plan.exerciseId))

    // Filter out exercises that user already has
    const availableExercises = allExercises
      .filter(exercise => !existingExerciseIds.has(exercise.id))
      .map(exercise => ({
        id: exercise.id,
        name: exercise.exerciseName,
        image: exercise.image
      }))

    return { success: true, data: availableExercises }
  } catch (error) {
    console.error('Error fetching available exercises:', error)
    return { success: false, error: 'Failed to fetch available exercises', data: [] }
  }
}

