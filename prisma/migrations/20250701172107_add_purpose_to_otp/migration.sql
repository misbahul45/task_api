/*
  Warnings:

  - Added the required column `purpose` to the `otp_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OTPPurpose" AS ENUM ('RESETPASS', 'VERIFYEMAIL', 'LOGIN');

-- DropIndex
DROP INDEX "otp_verifications_userId_key";

-- AlterTable
ALTER TABLE "otp_verifications" ADD COLUMN     "purpose" "OTPPurpose" NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3);
