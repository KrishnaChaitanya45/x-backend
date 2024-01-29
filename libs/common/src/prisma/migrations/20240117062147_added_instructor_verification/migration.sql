/*
  Warnings:

  - Added the required column `verified` to the `Instructors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instructors" ADD COLUMN     "verified" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "VerificationRequests" (
    "request_id" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "requested_on" TIMESTAMP(3) NOT NULL,
    "expires_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequests_pkey" PRIMARY KEY ("request_id")
);

-- AddForeignKey
ALTER TABLE "VerificationRequests" ADD CONSTRAINT "VerificationRequests_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Instructors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
