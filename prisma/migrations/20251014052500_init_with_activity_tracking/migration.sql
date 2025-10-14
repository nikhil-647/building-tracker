-- CreateEnum
CREATE TYPE "MuscleGroupEnum" AS ENUM ('Chest', 'Back', 'Shoulder', 'Legs', 'Bicep', 'Tricep', 'Abs', 'Cardio');

-- CreateEnum
CREATE TYPE "ActivityStatusEnum" AS ENUM ('pending', 'completed');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_group" (
    "id" SERIAL NOT NULL,
    "name" "MuscleGroupEnum" NOT NULL,

    CONSTRAINT "muscle_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "muscle_group_id" INTEGER NOT NULL,
    "exercise_name" VARCHAR(100) NOT NULL,
    "image" TEXT,
    "added_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_plan" (
    "id" SERIAL NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "exercise_group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_log" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "set_no" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "reps" INTEGER,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_template" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_activity" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "ActivityStatusEnum" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "muscle_group_name_key" ON "muscle_group"("name");

-- CreateIndex
CREATE INDEX "idx_exercise_user" ON "exercises"("added_by");

-- CreateIndex
CREATE INDEX "idx_exercise_plan_user" ON "exercise_plan"("user_id");

-- CreateIndex
CREATE INDEX "idx_exercise_plan_exercise" ON "exercise_plan"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_plan_user_id_exercise_group_id_exercise_id_key" ON "exercise_plan"("user_id", "exercise_group_id", "exercise_id");

-- CreateIndex
CREATE INDEX "idx_workout_log_user" ON "workout_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_log_template_id_set_no_user_id_date_key" ON "workout_log"("template_id", "set_no", "user_id", "date");

-- CreateIndex
CREATE INDEX "idx_activity_template_user" ON "activity_template"("user_id");

-- CreateIndex
CREATE INDEX "idx_daily_activity_user_date" ON "daily_activity"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_activity_template_id_user_id_date_key" ON "daily_activity"("template_id", "user_id", "date");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscle_group_id_fkey" FOREIGN KEY ("muscle_group_id") REFERENCES "muscle_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_plan" ADD CONSTRAINT "exercise_plan_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_plan" ADD CONSTRAINT "exercise_plan_exercise_group_id_fkey" FOREIGN KEY ("exercise_group_id") REFERENCES "muscle_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_plan" ADD CONSTRAINT "exercise_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_log" ADD CONSTRAINT "workout_log_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "exercise_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_log" ADD CONSTRAINT "workout_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_template" ADD CONSTRAINT "activity_template_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "activity_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
