-- DropForeignKey
ALTER TABLE "Instructors" DROP CONSTRAINT "Instructors_verificationId_fkey";

-- AlterTable
ALTER TABLE "Instructors" ALTER COLUMN "verificationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Instructors" ADD CONSTRAINT "Instructors_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "VerificationRequests"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;
