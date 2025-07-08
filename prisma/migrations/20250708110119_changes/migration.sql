/*
  Warnings:

  - You are about to drop the `sleepAssessments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sleepAssessments" DROP CONSTRAINT "sleepAssessments_userId_fkey";

-- DropTable
DROP TABLE "sleepAssessments";

-- CreateTable
CREATE TABLE "sleep_assessments" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "sleepStruggleDuration" TEXT,
    "bedtime" TEXT,
    "wakeTime" TEXT,
    "sleepHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sleep_assessments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sleep_assessments" ADD CONSTRAINT "sleep_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
