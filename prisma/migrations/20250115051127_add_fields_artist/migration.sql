/*
  Warnings:

  - You are about to alter the column `first_name` on the `artists` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `last_name` on the `artists` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `bio` on the `artists` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `email` on the `artists` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `artists` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - The `languages` column on the `artists` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `artists` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hebrew', 'Hindi', 'Armenian');

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "country" VARCHAR(50) NOT NULL,
ADD COLUMN     "industry" VARCHAR(50) NOT NULL,
ADD COLUMN     "links" VARCHAR(100)[],
ADD COLUMN     "title" VARCHAR(50) NOT NULL,
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(30),
DROP COLUMN "languages",
ADD COLUMN     "languages" "Languages"[];

-- CreateIndex
CREATE UNIQUE INDEX "artists_email_key" ON "artists"("email");
