/*
  Warnings:

  - A unique constraint covering the columns `[instructor_name]` on the table `VerificationRequests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructor_name` to the `VerificationRequests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Instructors" DROP CONSTRAINT "Instructors_verificationId_fkey";

-- AlterTable
ALTER TABLE "VerificationRequests" ADD COLUMN     "instructor_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequests_instructor_name_key" ON "VerificationRequests"("instructor_name");

-- AddForeignKey
ALTER TABLE "Instructors" ADD CONSTRAINT "Instructors_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "VerificationRequests"("instructor_name") ON DELETE RESTRICT ON UPDATE CASCADE;
