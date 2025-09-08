-- AlterTable
ALTER TABLE "opportunity_applications" ADD COLUMN     "attachments" JSONB NOT NULL DEFAULT '[]';
