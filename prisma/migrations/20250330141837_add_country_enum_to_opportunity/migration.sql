/*
  Warnings:

  - The `country_citizenship` column on the `opportunities` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `country_residence` column on the `opportunities` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "opportunities" DROP COLUMN "country_citizenship",
ADD COLUMN     "country_citizenship" "Country"[],
DROP COLUMN "country_residence",
ADD COLUMN     "country_residence" "Country"[];

-- CreateIndex
CREATE INDEX "opportunities_country_residence_idx" ON "opportunities" USING GIN ("country_residence");

-- CreateIndex
CREATE INDEX "opportunities_country_citizenship_idx" ON "opportunities" USING GIN ("country_citizenship");
