/*
  Warnings:

  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommunityToCourses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoursesToInstructors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoursesToSkills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoursesToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CommunityToCourses" DROP CONSTRAINT "_CommunityToCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommunityToCourses" DROP CONSTRAINT "_CommunityToCourses_B_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToInstructors" DROP CONSTRAINT "_CoursesToInstructors_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToInstructors" DROP CONSTRAINT "_CoursesToInstructors_B_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToSkills" DROP CONSTRAINT "_CoursesToSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToSkills" DROP CONSTRAINT "_CoursesToSkills_B_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToUser" DROP CONSTRAINT "_CoursesToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToUser" DROP CONSTRAINT "_CoursesToUser_B_fkey";

-- DropTable
DROP TABLE "Courses";

-- DropTable
DROP TABLE "_CommunityToCourses";

-- DropTable
DROP TABLE "_CoursesToInstructors";

-- DropTable
DROP TABLE "_CoursesToSkills";

-- DropTable
DROP TABLE "_CoursesToUser";

-- CreateTable
CREATE TABLE "Course" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewards" JSONB,
    "level" JSONB,
    "tags" TEXT[],
    "unique_name" TEXT NOT NULL,
    "icon" TEXT,
    "bg_image" TEXT,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewards" JSONB,
    "level" JSONB,
    "tags" TEXT[],
    "unique_name" TEXT,
    "icon" TEXT,
    "bg_image" TEXT,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewards" JSONB,
    "level" JSONB,
    "video_link" TEXT,
    "isVideo" BOOLEAN NOT NULL,
    "resource_link" TEXT[],
    "tags" TEXT[],
    "unique_name" TEXT,
    "icon" TEXT,
    "bg_image" TEXT,
    "challenges" JSONB,

    CONSTRAINT "CourseContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToInstructors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToModule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseContentToModule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToSkills_AB_unique" ON "_CourseToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToSkills_B_index" ON "_CourseToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToUser_AB_unique" ON "_CourseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToUser_B_index" ON "_CourseToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToInstructors_AB_unique" ON "_CourseToInstructors"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToInstructors_B_index" ON "_CourseToInstructors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToModule_AB_unique" ON "_CourseToModule"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToModule_B_index" ON "_CourseToModule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseContentToModule_AB_unique" ON "_CourseContentToModule"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseContentToModule_B_index" ON "_CourseContentToModule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToCourse_AB_unique" ON "_CommunityToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToCourse_B_index" ON "_CommunityToCourse"("B");

-- AddForeignKey
ALTER TABLE "_CourseToSkills" ADD CONSTRAINT "_CourseToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSkills" ADD CONSTRAINT "_CourseToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToUser" ADD CONSTRAINT "_CourseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToUser" ADD CONSTRAINT "_CourseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToInstructors" ADD CONSTRAINT "_CourseToInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToInstructors" ADD CONSTRAINT "_CourseToInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToModule" ADD CONSTRAINT "_CourseToModule_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToModule" ADD CONSTRAINT "_CourseToModule_B_fkey" FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseContentToModule" ADD CONSTRAINT "_CourseContentToModule_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseContentToModule" ADD CONSTRAINT "_CourseContentToModule_B_fkey" FOREIGN KEY ("B") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToCourse" ADD CONSTRAINT "_CommunityToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToCourse" ADD CONSTRAINT "_CommunityToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
