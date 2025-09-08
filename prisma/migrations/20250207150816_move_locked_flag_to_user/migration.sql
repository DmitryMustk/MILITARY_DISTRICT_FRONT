/*
  Warnings:

  - You are about to drop the column `locked` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `artist_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `providers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `providers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_provider_id_fkey";

-- AlterTable
ALTER TABLE "artists" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "locked",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "artist_id",
DROP COLUMN "provider_id",
ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "artists_user_id_key" ON "artists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "providers_user_id_key" ON "providers"("user_id");

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
