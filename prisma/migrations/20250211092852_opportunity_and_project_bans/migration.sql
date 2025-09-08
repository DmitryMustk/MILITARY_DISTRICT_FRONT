-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false;
