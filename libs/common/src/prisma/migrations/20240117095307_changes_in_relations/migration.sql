/*
  Warnings:

  - A unique constraint covering the columns `[verificationId]` on the table `Instructors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verificationId` to the `Instructors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Instructors" DROP CONSTRAINT "Instructors_id_fkey";

-- AlterTable
ALTER TABLE "Instructors" ADD COLUMN     "verificationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Instructors_verificationId_key" ON "Instructors"("verificationId");

-- AddForeignKey
ALTER TABLE "Instructors" ADD CONSTRAINT "Instructors_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "VerificationRequests"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;
