/*
  Warnings:

  - You are about to drop the column `email` on the `EmailResetRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentEmail]` on the table `EmailResetRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[newEmail]` on the table `EmailResetRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentEmail` to the `EmailResetRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newEmail` to the `EmailResetRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EmailResetRequest_email_key";

-- AlterTable
ALTER TABLE "EmailResetRequest" DROP COLUMN "email",
ADD COLUMN     "currentEmail" TEXT NOT NULL,
ADD COLUMN     "newEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmailResetRequest_currentEmail_key" ON "EmailResetRequest"("currentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "EmailResetRequest_newEmail_key" ON "EmailResetRequest"("newEmail");
