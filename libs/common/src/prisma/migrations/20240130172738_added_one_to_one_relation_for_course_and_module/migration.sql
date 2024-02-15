/*
  Warnings:

  - You are about to drop the `_CourseContentToModule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `module_id` to the `CourseContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CourseContentToModule" DROP CONSTRAINT "_CourseContentToModule_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseContentToModule" DROP CONSTRAINT "_CourseContentToModule_B_fkey";

-- AlterTable
ALTER TABLE "CourseContent" ADD COLUMN     "module_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CourseContentToModule";

-- AddForeignKey
ALTER TABLE "CourseContent" ADD CONSTRAINT "CourseContent_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
