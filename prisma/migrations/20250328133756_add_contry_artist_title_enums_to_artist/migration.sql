/*
  Warnings:

  - Changed the type of `title` on the `artists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `country_citizenship` on the `artists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `country_residence` on the `artists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "artists" DROP COLUMN "title",
ADD COLUMN     "title" "ArtistTitle" NOT NULL,
DROP COLUMN "country_citizenship",
ADD COLUMN     "country_citizenship" "Country" NOT NULL,
DROP COLUMN "country_residence",
ADD COLUMN     "country_residence" "Country" NOT NULL;

-- CreateIndex
CREATE INDEX "artists_country_residence_idx" ON "artists"("country_residence");

-- CreateIndex
CREATE INDEX "artists_country_citizenship_idx" ON "artists"("country_citizenship");
