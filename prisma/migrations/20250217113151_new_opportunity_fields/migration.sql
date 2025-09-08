-- CreateEnum
CREATE TYPE "LegalStatus" AS ENUM ('individual', 'collective', 'organization');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('cultural_and_natural_heritage', 'performance_and_celebration', 'visual_arts_and_crafts', 'books_and_press', 'audiovisual_and_interactive_media', 'design_and_creative_services');

-- CreateEnum
CREATE TYPE "ArtTheme" AS ENUM ('identity', 'heritage', 'social_justice_and_inclusion', 'democracy_and_freedom_of_expression', 'conflict_resolution_and_peace_building', 'ecology', 'technology', 'youth', 'innovation', 'education');

-- DropIndex
ALTER INDEX "opportunities_deadline_idx" RENAME TO "opportunities_application_deadline_idx";

ALTER TABLE "opportunities"
RENAME COLUMN "deadline" TO "application_deadline";

-- AlterTable
ALTER TABLE "opportunities"
ADD COLUMN     "country_citizenship" TEXT[],
ADD COLUMN     "country_residence" TEXT[],
ADD COLUMN     "gender" "Gender"[],
ADD COLUMN     "industry" "Industry"[],
ADD COLUMN     "legal_status" "LegalStatus"[],
ADD COLUMN     "location_description" TEXT,
ADD COLUMN     "max_age" INTEGER,
ADD COLUMN     "min_age" INTEGER,
ADD COLUMN     "response_deadline" TIMESTAMPTZ(6),
ADD COLUMN     "theme" "ArtTheme"[],
ADD COLUMN     "theme_description" TEXT;

-- CreateIndex
CREATE INDEX "opportunities_response_deadline_idx" ON "opportunities"("response_deadline");
