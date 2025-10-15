/**
 * Database Seed Script
 * 
 * This script populates your database with initial data.
 * Run it with: npm run db:seed
 * 
 * Important: Install ts-node if you want to use this:
 * npm install -D ts-node
 */

import { PrismaClient, MuscleGroupEnum } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Seed Muscle Groups with specific IDs
  console.log('📦 Seeding muscle groups...')
  
  // Clear existing muscle groups and exercises to ensure clean state
  await prisma.exercise.deleteMany({})
  await prisma.muscleGroup.deleteMany({})
  
  const muscleGroups = await Promise.all([
    prisma.muscleGroup.create({
      data: { id: 1, name: MuscleGroupEnum.Tricep }
    }),
    prisma.muscleGroup.create({
      data: { id: 2, name: MuscleGroupEnum.Back }
    }),
    prisma.muscleGroup.create({
      data: { id: 3, name: MuscleGroupEnum.Bicep }
    }),
    prisma.muscleGroup.create({
      data: { id: 4, name: MuscleGroupEnum.Chest }
    }),
    prisma.muscleGroup.create({
      data: { id: 5, name: MuscleGroupEnum.Shoulder }
    }),
    prisma.muscleGroup.create({
      data: { id: 6, name: MuscleGroupEnum.Abs }
    }),
    prisma.muscleGroup.create({
      data: { id: 7, name: MuscleGroupEnum.Legs }
    }),
    prisma.muscleGroup.create({
      data: { id: 8, name: MuscleGroupEnum.Cardio }
    })
  ])
  console.log(`✅ Created ${muscleGroups.length} muscle groups`)

  // 2. Seed Sample Exercises
  console.log('💪 Seeding sample exercises...')
  
  await prisma.exercise.createMany({
    data: [
      // Chest Exercises (ID: 4)
      { muscleGroupId: 4, exerciseName: 'Barbell Bench Press' },
      { muscleGroupId: 4, exerciseName: 'Incline Dumbbell Press' },
      { muscleGroupId: 4, exerciseName: 'Dumbbell Flyes' },
      { muscleGroupId: 4, exerciseName: 'Chest Dips' },
      { muscleGroupId: 4, exerciseName: 'Cable Crossover' },
      { muscleGroupId: 4, exerciseName: 'Push-Ups' },
      
      // Tricep Exercises (ID: 1)
      { muscleGroupId: 1, exerciseName: 'Overhead Triceps Extension' },
      { muscleGroupId: 1, exerciseName: 'Skull Crushers' },
      { muscleGroupId: 1, exerciseName: 'Triceps Dips' },
      { muscleGroupId: 1, exerciseName: 'Triceps Pushdown' },
      { muscleGroupId: 1, exerciseName: 'Triceps Rope Pushdown' },
      { muscleGroupId: 1, exerciseName: 'Triceps Pushdown Cable' },
      
      // Bicep Exercises (ID: 3)
      { muscleGroupId: 3, exerciseName: 'Single-Arm Cable Curl' },
      { muscleGroupId: 3, exerciseName: 'Chin-Up' },
      { muscleGroupId: 3, exerciseName: 'Preacher Curl' },
      { muscleGroupId: 3, exerciseName: 'Cable Curl' },
      { muscleGroupId: 3, exerciseName: 'Hammer Curl' },
      { muscleGroupId: 3, exerciseName: 'Barbell Curl' },
      { muscleGroupId: 3, exerciseName: 'Dumbbell Curl' },

      // Legs Exercises (ID: 7)
      { muscleGroupId: 7, exerciseName: 'Squats' },
      { muscleGroupId: 7, exerciseName: 'Lunges' },
      { muscleGroupId: 7, exerciseName: 'Deadlifts' },
      { muscleGroupId: 7, exerciseName: 'Leg Press' },
      { muscleGroupId: 7, exerciseName: 'Leg Extensions' },
      { muscleGroupId: 7, exerciseName: 'Leg Curls' },

      // Shoulder Exercises (ID: 5)
      { muscleGroupId: 5, exerciseName: 'Shoulder Press' },
      { muscleGroupId: 5, exerciseName: 'Shoulder Fly' },
      { muscleGroupId: 5, exerciseName: 'Shoulder Rotations' },
      { muscleGroupId: 5, exerciseName: 'Shoulder Front Raises' },
      { muscleGroupId: 5, exerciseName: 'Shoulder Back Raises' },
      { muscleGroupId: 5, exerciseName: 'Shoulder Front Raises' },

      // Abs Exercises (ID: 6)
      { muscleGroupId: 6, exerciseName: 'Planks' },
      { muscleGroupId: 6, exerciseName: 'Sit-Ups' },
      { muscleGroupId: 6, exerciseName: 'Leg Raises' },
      { muscleGroupId: 6, exerciseName: 'Russian Twists' },
      { muscleGroupId: 6, exerciseName: 'Mountain Climbers' },
      { muscleGroupId: 6, exerciseName: 'Leg Raises' },
      { muscleGroupId: 6, exerciseName: 'Russian Twists' },
      { muscleGroupId: 6, exerciseName: 'Mountain Climbers' },

      // Cardio Exercises (ID: 8)
      { muscleGroupId: 8, exerciseName: 'Running' },
      { muscleGroupId: 8, exerciseName: 'Cycling' },
      { muscleGroupId: 8, exerciseName: 'Swimming' },
      { muscleGroupId: 8, exerciseName: 'Rowing' },
      { muscleGroupId: 8, exerciseName: 'Elliptical' },
      { muscleGroupId: 8, exerciseName: 'Jump Rope' },
      { muscleGroupId: 8, exerciseName: 'Jump Rope' },

      // Back Exercises (ID: 2)
      { muscleGroupId: 2, exerciseName: 'Pull-Ups' },
      { muscleGroupId: 2, exerciseName: 'Bent-Over Rows ' },
      { muscleGroupId: 2, exerciseName: 'Lat Pulldowns' },
      { muscleGroupId: 2, exerciseName: 'Seated Cable Rows' },
      { muscleGroupId: 2, exerciseName: 'T-Bar Rows' },
      { muscleGroupId: 2, exerciseName: 'One-Arm Dumbbell Rows' }
      
    ],
    skipDuplicates: true
  })
  console.log('✅ Created sample exercises')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

