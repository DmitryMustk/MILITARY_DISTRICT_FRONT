/*
  Warnings:

  - You are about to alter the column `title` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `description` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `tags` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - Added the required column `exclusiveSupport` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_category` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_status` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Draft', 'Confirmed', 'Unconfirmed');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('Small', 'Medium', 'Large');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "exclusiveSupport" BOOLEAN NOT NULL,
ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "project_category" "ProjectCategory" NOT NULL,
ADD COLUMN     "project_status" "ProjectStatus" NOT NULL,
ADD COLUMN     "review_message" VARCHAR(300),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "tags" SET DATA TYPE VARCHAR(30)[];
