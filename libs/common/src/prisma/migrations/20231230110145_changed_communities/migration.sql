/*
  Warnings:

  - Added the required column `bg_image` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unique_name` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "bg_image" TEXT NOT NULL,
ADD COLUMN     "level" JSONB,
ADD COLUMN     "rules" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "unique_name" TEXT NOT NULL;
