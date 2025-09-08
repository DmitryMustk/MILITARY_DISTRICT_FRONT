/*
  Warnings:

  - You are about to drop the column `country` on the `artists` table. All the data in the column will be lost.
  - Added the required column `country_citizenship` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_residence` to the `artists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "artists" DROP COLUMN "country",
ADD COLUMN     "country_citizenship" VARCHAR(50) NOT NULL,
ADD COLUMN     "country_residence" VARCHAR(50) NOT NULL;
