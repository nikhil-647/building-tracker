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

  // 1. Seed Muscle Groups
  console.log('📦 Seeding muscle groups...')
  const muscleGroups = await Promise.all([
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Chest },
      update: {},
      create: { name: MuscleGroupEnum.Chest }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Back },
      update: {},
      create: { name: MuscleGroupEnum.Back }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Shoulder },
      update: {},
      create: { name: MuscleGroupEnum.Shoulder }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Legs },
      update: {},
      create: { name: MuscleGroupEnum.Legs }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Bicep },
      update: {},
      create: { name: MuscleGroupEnum.Bicep }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Tricep },
      update: {},
      create: { name: MuscleGroupEnum.Tricep }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Abs },
      update: {},
      create: { name: MuscleGroupEnum.Abs }
    }),
    prisma.muscleGroup.upsert({
      where: { name: MuscleGroupEnum.Cardio },
      update: {},
      create: { name: MuscleGroupEnum.Cardio }
    })
  ])
  console.log(`✅ Created ${muscleGroups.length} muscle groups`)

  // 2. Seed Test User
  console.log('👤 Seeding test user...')
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123', // In production, use hashed password
      image: null
    }
  })
  console.log(`✅ Created test user: ${testUser.email}`)

  // 3. Seed Sample Exercises
  console.log('💪 Seeding sample exercises...')
  const chestGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Chest)!
  const backGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Back)!
  const shoulderGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Shoulder)!
  const legsGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Legs)!
  const bicepGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Bicep)!
  const tricepGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Tricep)!
  const absGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Abs)!
  const cardioGroup = muscleGroups.find(g => g.name === MuscleGroupEnum.Cardio)!
  
  await prisma.exercise.createMany({
    data: [
      // Chest Exercises
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Bench Press',
        addedBy: testUser.id
      },
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Incline Bench Press',
        addedBy: testUser.id
      },
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Decline Bench Press',
        addedBy: testUser.id
      },
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Dumbbell Flyes',
        addedBy: testUser.id
      },
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Push-ups',
        addedBy: testUser.id
      },
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Cable Crossover',
        addedBy: testUser.id
      },
      
      // Back Exercises
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Pull-ups',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Deadlift',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Barbell Row',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Lat Pulldown',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Seated Cable Row',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'T-Bar Row',
        addedBy: testUser.id
      },
      
      // Shoulder Exercises
      {
        muscleGroupId: shoulderGroup.id,
        exerciseName: 'Overhead Press',
        addedBy: testUser.id
      },
      {
        muscleGroupId: shoulderGroup.id,
        exerciseName: 'Lateral Raise',
        addedBy: testUser.id
      },
      {
        muscleGroupId: shoulderGroup.id,
        exerciseName: 'Front Raise',
        addedBy: testUser.id
      },
      {
        muscleGroupId: shoulderGroup.id,
        exerciseName: 'Rear Delt Flyes',
        addedBy: testUser.id
      },
      {
        muscleGroupId: shoulderGroup.id,
        exerciseName: 'Arnold Press',
        addedBy: testUser.id
      },
      
      // Legs Exercises
      {
        muscleGroupId: legsGroup.id,
        exerciseName: 'Squat',
        addedBy: testUser.id
      },
      {
        muscleGroupId: legsGroup.id,
        exerciseName: 'Leg Press',
        addedBy: testUser.id
      },
      {
        muscleGroupId: legsGroup.id,
        exerciseName: 'Lunges',
        addedBy: testUser.id
      },
      {
        muscleGroupId: legsGroup.id,
        exerciseName: 'Leg Extension',
        addedBy: testUser.id
      },
      {
        muscleGroupId: legsGroup.id,
        exerciseName: 'Leg Curl',
        addedBy: testUser.id
      },
      {
        muscleGroupId: legsGroup.id,
        exerciseName: 'Calf Raise',
        addedBy: testUser.id
      },
      
      // Bicep Exercises
      {
        muscleGroupId: bicepGroup.id,
        exerciseName: 'Barbell Curl',
        addedBy: testUser.id
      },
      {
        muscleGroupId: bicepGroup.id,
        exerciseName: 'Dumbbell Curl',
        addedBy: testUser.id
      },
      {
        muscleGroupId: bicepGroup.id,
        exerciseName: 'Hammer Curl',
        addedBy: testUser.id
      },
      {
        muscleGroupId: bicepGroup.id,
        exerciseName: 'Preacher Curl',
        addedBy: testUser.id
      },
      {
        muscleGroupId: bicepGroup.id,
        exerciseName: 'Concentration Curl',
        addedBy: testUser.id
      },
      
      // Tricep Exercises
      {
        muscleGroupId: tricepGroup.id,
        exerciseName: 'Tricep Dips',
        addedBy: testUser.id
      },
      {
        muscleGroupId: tricepGroup.id,
        exerciseName: 'Tricep Pushdown',
        addedBy: testUser.id
      },
      {
        muscleGroupId: tricepGroup.id,
        exerciseName: 'Overhead Tricep Extension',
        addedBy: testUser.id
      },
      {
        muscleGroupId: tricepGroup.id,
        exerciseName: 'Skull Crushers',
        addedBy: testUser.id
      },
      {
        muscleGroupId: tricepGroup.id,
        exerciseName: 'Close Grip Bench Press',
        addedBy: testUser.id
      },
      
      // Abs Exercises
      {
        muscleGroupId: absGroup.id,
        exerciseName: 'Crunches',
        addedBy: testUser.id
      },
      {
        muscleGroupId: absGroup.id,
        exerciseName: 'Plank',
        addedBy: testUser.id
      },
      {
        muscleGroupId: absGroup.id,
        exerciseName: 'Russian Twists',
        addedBy: testUser.id
      },
      {
        muscleGroupId: absGroup.id,
        exerciseName: 'Leg Raises',
        addedBy: testUser.id
      },
      {
        muscleGroupId: absGroup.id,
        exerciseName: 'Mountain Climbers',
        addedBy: testUser.id
      },
      {
        muscleGroupId: absGroup.id,
        exerciseName: 'Bicycle Crunches',
        addedBy: testUser.id
      },
      
      // Cardio Exercises
      {
        muscleGroupId: cardioGroup.id,
        exerciseName: 'Running',
        addedBy: testUser.id
      },
      {
        muscleGroupId: cardioGroup.id,
        exerciseName: 'Cycling',
        addedBy: testUser.id
      },
      {
        muscleGroupId: cardioGroup.id,
        exerciseName: 'Jump Rope',
        addedBy: testUser.id
      },
      {
        muscleGroupId: cardioGroup.id,
        exerciseName: 'Rowing',
        addedBy: testUser.id
      },
      {
        muscleGroupId: cardioGroup.id,
        exerciseName: 'Burpees',
        addedBy: testUser.id
      },
      {
        muscleGroupId: cardioGroup.id,
        exerciseName: 'Swimming',
        addedBy: testUser.id
      }
    ],
    skipDuplicates: true
  })
  console.log('✅ Created sample exercises for all muscle groups')

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

