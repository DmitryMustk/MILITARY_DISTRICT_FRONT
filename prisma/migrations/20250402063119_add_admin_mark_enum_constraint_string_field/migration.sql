/*
  Warnings:

  - You are about to alter the column `description` on the `opportunities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `theme_description` on the `opportunities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "opportunities" ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "theme_description" SET DATA TYPE VARCHAR(300);
