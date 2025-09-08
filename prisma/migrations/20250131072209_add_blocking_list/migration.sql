-- CreateTable
CREATE TABLE "_ArtistToProvider" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArtistToProvider_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArtistToProvider_B_index" ON "_ArtistToProvider"("B");

-- AddForeignKey
ALTER TABLE "_ArtistToProvider" ADD CONSTRAINT "_ArtistToProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToProvider" ADD CONSTRAINT "_ArtistToProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
