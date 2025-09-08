/*
  Warnings:

  - You are about to drop the column `exclusiveSupport` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "exclusiveSupport",
ADD COLUMN     "exclusive_support" BOOLEAN NOT NULL DEFAULT false;
