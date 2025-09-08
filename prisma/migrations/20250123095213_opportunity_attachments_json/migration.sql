/*
  Warnings:

  - You are about to drop the column `attachments_ids` on the `opportunities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opportunities" DROP COLUMN "attachments_ids",
ADD COLUMN     "attachments" JSONB NOT NULL DEFAULT '{}';
