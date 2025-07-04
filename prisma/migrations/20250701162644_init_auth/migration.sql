/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `otp_verifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "otp_verifications_otp_key" ON "otp_verifications"("otp");
