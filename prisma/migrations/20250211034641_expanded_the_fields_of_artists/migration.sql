/*
  Warnings:

  - The `industry` column on the `artists` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `birth_day` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statement` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `artists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "artist_name" VARCHAR(50),
ADD COLUMN     "birth_day" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "statement" VARCHAR(2000) NOT NULL,
ADD COLUMN     "theme" VARCHAR(100) NOT NULL,
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(2000),
DROP COLUMN "industry",
ADD COLUMN     "industry" VARCHAR(50)[];
