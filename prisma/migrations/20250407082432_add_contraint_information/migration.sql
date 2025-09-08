/*
  Warnings:

  - You are about to alter the column `information` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "providers" ALTER COLUMN "information" SET DATA TYPE VARCHAR(1000);
