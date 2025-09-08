/*
  Warnings:

  - You are about to drop the column `text` on the `news` table. All the data in the column will be lost.
  - Added the required column `uuid` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "news" DROP COLUMN "text",
ADD COLUMN     "blocks" TEXT,
ADD COLUMN     "html" TEXT,
ADD COLUMN     "uuid" VARCHAR(36) NOT NULL;
