/*
  Warnings:

  - The primary key for the `invite_artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `invite_artist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `invite_artist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `amount` on the `opportunities` table. All the data in the column will be lost.
  - You are about to drop the column `eligibility` on the `opportunities` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `opportunities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `title` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `tags` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(16)`.
  - You are about to alter the column `organization_name` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `representative_name` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `website` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - You are about to alter the column `email` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - Added the required column `visibility` to the `opportunities` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `opportunities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('grant', 'other');

-- CreateEnum
CREATE TYPE "OpportunityVisibility" AS ENUM ('nobody', 'invited', 'all');

-- AlterTable
ALTER TABLE "invite_artist" DROP CONSTRAINT "invite_artist_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "invite_artist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "opportunities" DROP COLUMN "amount",
DROP COLUMN "eligibility",
ADD COLUMN     "max_amount" DECIMAL(65,30),
ADD COLUMN     "min_amount" DECIMAL(65,30),
ADD COLUMN     "visibility" "OpportunityVisibility" NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(50),
DROP COLUMN "type",
ADD COLUMN     "type" "OpportunityType" NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "tags" SET DATA TYPE VARCHAR(16)[];

-- AlterTable
ALTER TABLE "providers" ALTER COLUMN "organization_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "representative_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "website" SET DATA TYPE VARCHAR(512),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider_id" INTEGER,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(512);

-- CreateIndex
CREATE INDEX "opportunities_type_idx" ON "opportunities"("type");

-- CreateIndex
CREATE INDEX "opportunities_deadline_idx" ON "opportunities"("deadline");

-- CreateIndex
CREATE INDEX "opportunities_visibility_idx" ON "opportunities"("visibility");

-- CreateIndex
CREATE INDEX "opportunities_provider_id_idx" ON "opportunities"("provider_id");

-- CreateIndex
CREATE INDEX "projects_tags_idx" ON "projects"("tags");

-- CreateIndex
CREATE INDEX "projects_artist_id_idx" ON "projects"("artist_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
