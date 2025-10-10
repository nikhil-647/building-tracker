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
  
  await prisma.exercise.createMany({
    data: [
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Bench Press',
        addedBy: testUser.id
      },
      {
        muscleGroupId: chestGroup.id,
        exerciseName: 'Push-ups',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Pull-ups',
        addedBy: testUser.id
      },
      {
        muscleGroupId: backGroup.id,
        exerciseName: 'Deadlift',
        addedBy: testUser.id
      }
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

