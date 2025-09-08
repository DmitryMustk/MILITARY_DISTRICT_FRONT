-- CreateTable
CREATE TABLE "opportunity_invite_unregistered_artist" (
    "id" SERIAL NOT NULL,
    "opportunity_id" INTEGER NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "artist_invite_id" TEXT NOT NULL,

    CONSTRAINT "opportunity_invite_unregistered_artist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "opportunity_invite_unregistered_artist" ADD CONSTRAINT "opportunity_invite_unregistered_artist_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_invite_unregistered_artist" ADD CONSTRAINT "opportunity_invite_unregistered_artist_artist_invite_id_fkey" FOREIGN KEY ("artist_invite_id") REFERENCES "invite_artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
