/*
  Warnings:

  - You are about to drop the column `email` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `providers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "artists_email_key";

-- AlterTable
ALTER TABLE "artists" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
