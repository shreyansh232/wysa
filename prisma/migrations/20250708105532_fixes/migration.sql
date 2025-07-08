/*
  Warnings:

  - You are about to drop the column `created_at` on the `sleep_assessments` table. All the data in the column will be lost.
  - You are about to drop the column `sleep_hours` on the `sleep_assessments` table. All the data in the column will be lost.
  - You are about to drop the column `sleep_struggle_duration` on the `sleep_assessments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `sleep_assessments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `sleep_assessments` table. All the data in the column will be lost.
  - You are about to drop the column `wake_time` on the `sleep_assessments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `sleep_assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sleep_assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sleep_assessments" DROP CONSTRAINT "sleep_assessments_user_id_fkey";

-- AlterTable
ALTER TABLE "sleep_assessments" DROP COLUMN "created_at",
DROP COLUMN "sleep_hours",
DROP COLUMN "sleep_struggle_duration",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
DROP COLUMN "wake_time",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sleepHours" INTEGER,
ADD COLUMN     "sleepStruggleDuration" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "wakeTime" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "sleep_assessments" ADD CONSTRAINT "sleep_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
