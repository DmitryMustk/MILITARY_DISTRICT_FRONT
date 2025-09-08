-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "link" VARCHAR(100),
ADD COLUMN     "poster_image" JSONB NOT NULL DEFAULT '{}';
