/*
  Warnings:

  - You are about to drop the column `project_status` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `review_message` on the `projects` table. All the data in the column will be lost.
  - Added the required column `moderation_comment` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderation_status` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderation_comment` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderation_status` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('Draft', 'OnModeration', 'Approved', 'Denied');

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "moderation_comment" VARCHAR(1000) NOT NULL,
ADD COLUMN     "moderation_status" "ModerationStatus" NOT NULL,
ADD COLUMN     "moderator_id" INTEGER;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "project_status",
DROP COLUMN "review_message",
ADD COLUMN     "moderation_comment" VARCHAR(1000) NOT NULL,
ADD COLUMN     "moderation_status" "ModerationStatus" NOT NULL,
ADD COLUMN     "moderator_id" INTEGER;

-- DropEnum
DROP TYPE "ProjectStatus";

-- CreateTable
CREATE TABLE "moderators" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "moderators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "moderators_user_id_key" ON "moderators"("user_id");

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "moderators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "moderators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderators" ADD CONSTRAINT "moderators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
