-- DropForeignKey
ALTER TABLE "VerificationRequests" DROP CONSTRAINT "VerificationRequests_request_id_fkey";

-- AddForeignKey
ALTER TABLE "Instructors" ADD CONSTRAINT "Instructors_id_fkey" FOREIGN KEY ("id") REFERENCES "VerificationRequests"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;
