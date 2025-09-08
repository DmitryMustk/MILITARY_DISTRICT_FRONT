-- DropForeignKey
ALTER TABLE "opportunity_invite_unregistered_artist" DROP CONSTRAINT "opportunity_invite_unregistered_artist_opportunity_id_fkey";

-- CreateIndex
CREATE INDEX "opportunity_invite_unregistered_artist_opportunity_id_idx" ON "opportunity_invite_unregistered_artist"("opportunity_id");

-- CreateIndex
CREATE INDEX "opportunity_invite_unregistered_artist_artist_invite_id_idx" ON "opportunity_invite_unregistered_artist"("artist_invite_id");

-- AddForeignKey
ALTER TABLE "opportunity_invite_unregistered_artist" ADD CONSTRAINT "opportunity_invite_unregistered_artist_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
