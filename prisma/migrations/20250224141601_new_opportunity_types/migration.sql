-- CreateEnum
CREATE TYPE "ResidencyOffering" AS ENUM ('accommodation', 'transportation', 'workspace', 'allowance');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OpportunityType" ADD VALUE 'residency';
ALTER TYPE "OpportunityType" ADD VALUE 'award';
ALTER TYPE "OpportunityType" ADD VALUE 'mobility';
ALTER TYPE "OpportunityType" ADD VALUE 'commission';


-- Alter Indexes
ALTER INDEX "opportunities_min_amount_idx" RENAME TO "opportunities_min_grant_amount_idx";
ALTER INDEX "opportunities_max_amount_idx" RENAME TO "opportunities_max_grant_amount_idx";

-- Alter Table
ALTER TABLE "opportunities" RENAME COLUMN "min_amount" TO "min_grant_amount";
ALTER TABLE "opportunities" RENAME COLUMN "max_amount" TO "max_grant_amount";

-- AlterTable
ALTER TABLE "opportunities"
ADD COLUMN  "award_special_access" TEXT,
ADD COLUMN  "max_award_amount" INTEGER,
ADD COLUMN  "max_residency_time" INTEGER,
ADD COLUMN  "min_award_amount" INTEGER,
ADD COLUMN  "min_residency_time" INTEGER,
ADD COLUMN  "residency_offering" "ResidencyOffering"[],
ADD COLUMN  "residency_offering_description" TEXT;

-- CreateIndex
CREATE INDEX "opportunities_min_residency_time_idx" ON "opportunities"("min_residency_time");

-- CreateIndex
CREATE INDEX "opportunities_max_residency_time_idx" ON "opportunities"("max_residency_time");

-- CreateIndex
CREATE INDEX "opportunities_residency_offering_idx" ON "opportunities" USING GIN ("residency_offering");

-- CreateIndex
CREATE INDEX "opportunities_min_award_amount_idx" ON "opportunities"("min_award_amount");

-- CreateIndex
CREATE INDEX "opportunities_max_award_amount_idx" ON "opportunities"("max_award_amount");
