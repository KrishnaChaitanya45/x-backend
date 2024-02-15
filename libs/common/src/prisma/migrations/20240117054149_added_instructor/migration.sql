/*
  Warnings:

  - You are about to drop the `_CommunityToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityToUser" DROP CONSTRAINT "_CommunityToUser_B_fkey";

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "icon" TEXT;

-- DropTable
DROP TABLE "_CommunityToUser";

-- CreateTable
CREATE TABLE "Instructors" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" BIGINT,
    "education" TEXT,
    "profilePhoto" TEXT,
    "refreshToken" TEXT,
    "achievements" JSONB,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location" TEXT,
    "work_experience" JSONB,
    "socials" JSONB,

    CONSTRAINT "Instructors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InstructorsToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoursesToInstructors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityModerators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BadgesToInstructors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Instructors_user_name_key" ON "Instructors"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "Instructors_email_key" ON "Instructors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_InstructorsToSkills_AB_unique" ON "_InstructorsToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_InstructorsToSkills_B_index" ON "_InstructorsToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoursesToInstructors_AB_unique" ON "_CoursesToInstructors"("A", "B");

-- CreateIndex
CREATE INDEX "_CoursesToInstructors_B_index" ON "_CoursesToInstructors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityModerators_AB_unique" ON "_CommunityModerators"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityModerators_B_index" ON "_CommunityModerators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityMembers_AB_unique" ON "_CommunityMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityMembers_B_index" ON "_CommunityMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BadgesToInstructors_AB_unique" ON "_BadgesToInstructors"("A", "B");

-- CreateIndex
CREATE INDEX "_BadgesToInstructors_B_index" ON "_BadgesToInstructors"("B");

-- AddForeignKey
ALTER TABLE "_InstructorsToSkills" ADD CONSTRAINT "_InstructorsToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstructorsToSkills" ADD CONSTRAINT "_InstructorsToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToInstructors" ADD CONSTRAINT "_CoursesToInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToInstructors" ADD CONSTRAINT "_CoursesToInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityModerators" ADD CONSTRAINT "_CommunityModerators_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityModerators" ADD CONSTRAINT "_CommunityModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityMembers" ADD CONSTRAINT "_CommunityMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityMembers" ADD CONSTRAINT "_CommunityMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgesToInstructors" ADD CONSTRAINT "_BadgesToInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES "Badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgesToInstructors" ADD CONSTRAINT "_BadgesToInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
