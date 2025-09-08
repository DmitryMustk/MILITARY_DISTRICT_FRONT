/*
  Warnings:

  - Added the required column `status` to the `opportunity_applications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OpportunityApplicationStatus" AS ENUM ('new', 'sent', 'shortlisted', 'rejected', 'archived', 'viewlater');

-- AlterTable
ALTER TABLE "opportunity_applications" ADD COLUMN     "status" "OpportunityApplicationStatus" NOT NULL;
