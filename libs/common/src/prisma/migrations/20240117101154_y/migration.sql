-- DropForeignKey
ALTER TABLE "Instructors" DROP CONSTRAINT "Instructors_id_fkey";

-- AddForeignKey
ALTER TABLE "VerificationRequests" ADD CONSTRAINT "VerificationRequests_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "Instructors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
