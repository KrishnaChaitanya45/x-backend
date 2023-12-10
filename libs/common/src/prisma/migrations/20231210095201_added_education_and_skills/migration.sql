/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Skills` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" JSONB,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "socials" JSONB,
ADD COLUMN     "work_experience" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Skills_name_key" ON "Skills"("name");
