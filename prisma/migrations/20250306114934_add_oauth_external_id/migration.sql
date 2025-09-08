/*
  Warnings:

  - A unique constraint covering the columns `[oauth_external_id]` on the table `invite_artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[oauth_external_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "invite_artist" ADD COLUMN     "oauth_external_id" VARCHAR(128);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "oauth_external_id" VARCHAR(128),
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invite_artist_oauth_external_id_key" ON "invite_artist"("oauth_external_id");

-- CreateIndex
CREATE INDEX "invite_artist_email_idx" ON "invite_artist"("email");

-- CreateIndex
CREATE INDEX "invite_artist_oauth_external_id_idx" ON "invite_artist"("oauth_external_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_oauth_external_id_key" ON "users"("oauth_external_id");

-- CreateIndex
CREATE INDEX "users_oauth_external_id_idx" ON "users"("oauth_external_id");
