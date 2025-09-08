-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "attachments_ids" VARCHAR(24)[];

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "exclusiveSupport" SET DEFAULT false;
