-- CreateEnum
CREATE TYPE "AdminMark" AS ENUM ('complete', 'incomplete', 'spam', 'need_attention');

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "admin_mark" "AdminMark" NOT NULL DEFAULT 'incomplete';
