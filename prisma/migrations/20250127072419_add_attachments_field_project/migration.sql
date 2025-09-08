-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "attachments" JSONB NOT NULL DEFAULT '[]';
