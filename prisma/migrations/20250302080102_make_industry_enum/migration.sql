/*
  Warnings:

  - The `industry` column on the `artists` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "artists" DROP COLUMN "industry",
ADD COLUMN     "industry" "Industry"[];

-- CreateIndex
CREATE INDEX "artists_industry_idx" ON "artists" USING GIN ("industry");
