-- AlterTable
ALTER TABLE "artists" ALTER COLUMN "languages" SET DEFAULT ARRAY[]::"Languages"[],
ALTER COLUMN "industry" SET DEFAULT ARRAY[]::"Industry"[];
