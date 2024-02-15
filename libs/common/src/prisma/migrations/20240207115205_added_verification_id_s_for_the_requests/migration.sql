-- AlterTable
ALTER TABLE "VerificationRequests" ADD COLUMN     "verified_by" TEXT;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "refreshToken" TEXT,
    "profilePhoto" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_name_key" ON "Admin"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "VerificationRequests" ADD CONSTRAINT "VerificationRequests_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
