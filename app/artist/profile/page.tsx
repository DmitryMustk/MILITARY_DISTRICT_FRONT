import { getFullCurrentArtist } from '@/lib/artist/queries';
import { calculateArtistProfileComplete } from '@/lib/artist/utils';
import { ArtistCardFull } from '@/components/artist/artist-card-full';

export default async function MyArtistPage({ searchParams }: { searchParams: Promise<{ fromArtists?: string }> }) {
  const { artist, projectCount, activeApplicationCount, submittedApplications, lastOpenApplication } =
    await getFullCurrentArtist();

  const artistProfileComplete = calculateArtistProfileComplete(artist);
  const needBackButton = (await searchParams).fromArtists === 'true';

  return (
    <div className="flex w-full justify-center min-h-[calc(100vh-200px)]">
      <ArtistCardFull
        className="max-w-[590px] border-none md:border-solid m-auto"
        artist={artist}
        artistId={artist.id.toString()}
        artistProfileComplete={artistProfileComplete}
        projectCount={projectCount}
        activeApplicationCount={activeApplicationCount}
        submittedApplications={submittedApplications}
        lastOpenApplication={lastOpenApplication?._min.updatedAt}
        needBackButton={needBackButton}
      />
    </div>
  );
}
