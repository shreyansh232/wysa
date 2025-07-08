/*
  Warnings:

  - You are about to drop the `sleep_assessments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sleep_assessments" DROP CONSTRAINT "sleep_assessments_userId_fkey";

-- DropTable
DROP TABLE "sleep_assessments";

-- CreateTable
CREATE TABLE "sleepAssessments" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "sleepStruggleDuration" TEXT,
    "bedTime" TEXT,
    "wakeTime" TEXT,
    "sleepHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sleepAssessments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sleepAssessments" ADD CONSTRAINT "sleepAssessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
