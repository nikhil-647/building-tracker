import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Navbar } from '@/components/navbar'
import { LogWorkoutClient } from './log-workout-client'
import type { MuscleGroup, GroupedExercise, ExercisesByMuscleGroup } from '@/types/workout'

export default async function LogWorkout() {
  // Check authentication on server
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { email: session.user.email! }
  })

  if (!user) {
    redirect('/login')
  }

  // Fetch all muscle groups (always show these)
  const muscleGroups = await db.muscleGroup.findMany({
    orderBy: { id: 'asc' }
  })

  // Fetch ALL exercises from database grouped by muscle group
  const allExercises = await db.exercise.findMany({
    include: {
      muscleGroup: true
    },
    orderBy: {
      exerciseName: 'asc'
    }
  })

  // Group all exercises by muscle group
  const exercisesByMuscleGroup: ExercisesByMuscleGroup = {}
  
  allExercises.forEach((exercise) => {
    const muscleGroupName = exercise.muscleGroup.name
    if (!exercisesByMuscleGroup[muscleGroupName]) {
      exercisesByMuscleGroup[muscleGroupName] = []
    }
    exercisesByMuscleGroup[muscleGroupName].push({
      id: exercise.id,
      name: exercise.exerciseName,
      image: exercise.image,
      muscleGroupId: exercise.muscleGroupId
    })
  })

  // Fetch user's exercise plan with related exercise and muscle group data
  const exercisePlans = await db.exercisePlan.findMany({
    where: { userId: user.id },
    include: {
      exercise: true,
      muscleGroup: true
    }
  })

  // Group user's exercises by muscle group
  const groupedExercises: Record<string, GroupedExercise[]> = {}
  
  exercisePlans.forEach((plan: {
    id: number
    exercise: { id: number; exerciseName: string; image: string | null }
    muscleGroup: { name: string }
  }) => {
    const muscleGroupName = plan.muscleGroup.name
    if (!groupedExercises[muscleGroupName]) {
      groupedExercises[muscleGroupName] = []
    }
    groupedExercises[muscleGroupName].push({
      id: plan.exercise.id,
      name: plan.exercise.exerciseName,
      image: plan.exercise.image,
      planId: plan.id
    })
  })

  // Transform muscle groups to simple format
  const muscleGroupsData: MuscleGroup[] = muscleGroups.map((mg) => ({
    id: mg.id,
    name: mg.name
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <LogWorkoutClient 
        muscleGroups={muscleGroupsData}
        userExercisePlan={groupedExercises}
        allExercises={exercisesByMuscleGroup}
      />
    </div>
  )
}
