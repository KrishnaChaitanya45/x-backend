/*
  Warnings:

  - You are about to drop the column `instructor_name` on the `VerificationRequests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instructor_id]` on the table `VerificationRequests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructor_id` to the `VerificationRequests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Instructors" DROP CONSTRAINT "Instructors_user_name_fkey";

-- DropIndex
DROP INDEX "VerificationRequests_instructor_name_key";

-- AlterTable
ALTER TABLE "VerificationRequests" DROP COLUMN "instructor_name",
ADD COLUMN     "instructor_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequests_instructor_id_key" ON "VerificationRequests"("instructor_id");

-- AddForeignKey
ALTER TABLE "Instructors" ADD CONSTRAINT "Instructors_id_fkey" FOREIGN KEY ("id") REFERENCES "VerificationRequests"("instructor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
