-- CreateEnum
CREATE TYPE "OpportunityInviteStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "opportunity_invites" (
    "id" SERIAL NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "opportunity_id" INTEGER NOT NULL,
    "message" VARCHAR(16384) NOT NULL,
    "status" "OpportunityInviteStatus" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "opportunity_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "opportunity_invites_artist_id_idx" ON "opportunity_invites"("artist_id");

-- CreateIndex
CREATE INDEX "opportunity_invites_opportunity_id_idx" ON "opportunity_invites"("opportunity_id");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_invites_artist_id_opportunity_id_key" ON "opportunity_invites"("artist_id", "opportunity_id");

-- AddForeignKey
ALTER TABLE "opportunity_invites" ADD CONSTRAINT "opportunity_invites_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_invites" ADD CONSTRAINT "opportunity_invites_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
