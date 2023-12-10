-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" BIGINT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Awards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wars" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Wars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SkillsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillsToWars" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoursesToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoursesToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityToCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityToWars" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AwardsToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BadgesToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillsToUser_AB_unique" ON "_SkillsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillsToUser_B_index" ON "_SkillsToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillsToWars_AB_unique" ON "_SkillsToWars"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillsToWars_B_index" ON "_SkillsToWars"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoursesToSkills_AB_unique" ON "_CoursesToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_CoursesToSkills_B_index" ON "_CoursesToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoursesToUser_AB_unique" ON "_CoursesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CoursesToUser_B_index" ON "_CoursesToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToUser_AB_unique" ON "_CommunityToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToUser_B_index" ON "_CommunityToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToCourses_AB_unique" ON "_CommunityToCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToCourses_B_index" ON "_CommunityToCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToWars_AB_unique" ON "_CommunityToWars"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToWars_B_index" ON "_CommunityToWars"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AwardsToCommunity_AB_unique" ON "_AwardsToCommunity"("A", "B");

-- CreateIndex
CREATE INDEX "_AwardsToCommunity_B_index" ON "_AwardsToCommunity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BadgesToUser_AB_unique" ON "_BadgesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BadgesToUser_B_index" ON "_BadgesToUser"("B");

-- AddForeignKey
ALTER TABLE "_SkillsToUser" ADD CONSTRAINT "_SkillsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToUser" ADD CONSTRAINT "_SkillsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToWars" ADD CONSTRAINT "_SkillsToWars_A_fkey" FOREIGN KEY ("A") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToWars" ADD CONSTRAINT "_SkillsToWars_B_fkey" FOREIGN KEY ("B") REFERENCES "Wars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToSkills" ADD CONSTRAINT "_CoursesToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToSkills" ADD CONSTRAINT "_CoursesToSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToUser" ADD CONSTRAINT "_CoursesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToUser" ADD CONSTRAINT "_CoursesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToUser" ADD CONSTRAINT "_CommunityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToCourses" ADD CONSTRAINT "_CommunityToCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToCourses" ADD CONSTRAINT "_CommunityToCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToWars" ADD CONSTRAINT "_CommunityToWars_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityToWars" ADD CONSTRAINT "_CommunityToWars_B_fkey" FOREIGN KEY ("B") REFERENCES "Wars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AwardsToCommunity" ADD CONSTRAINT "_AwardsToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Awards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AwardsToCommunity" ADD CONSTRAINT "_AwardsToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgesToUser" ADD CONSTRAINT "_BadgesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgesToUser" ADD CONSTRAINT "_BadgesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
