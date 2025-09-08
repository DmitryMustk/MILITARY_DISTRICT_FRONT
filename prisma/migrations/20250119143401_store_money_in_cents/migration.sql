/*
  Warnings:

  - You are about to alter the column `max_amount` on the `opportunities` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `min_amount` on the `opportunities` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "opportunities" ALTER COLUMN "max_amount" SET DATA TYPE INTEGER,
ALTER COLUMN "min_amount" SET DATA TYPE INTEGER;
