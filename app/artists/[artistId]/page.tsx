import { getFullArtist } from '@/lib/artist/queries';
import { ArtistCardFull } from '@/components/artist/artist-card-full';

export default async function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const {
    artist,
    projectCount,
    activeApplicationCount,
    artistProfileComplete,
    submittedApplications,
    lastOpenApplication,
  } = await getFullArtist(artistId);

  return (
    <div className="flex w-full justify-center min-h-[calc(100vh-200px)]">
      <ArtistCardFull
        className="max-w-[590px] border-none md:border-solid m-auto"
        artist={artist}
        artistId={artistId}
        lastOpenApplication={lastOpenApplication?._min.updatedAt}
        artistProfileComplete={artistProfileComplete}
        projectCount={projectCount}
        activeApplicationCount={activeApplicationCount}
        submittedApplications={submittedApplications}
        needBackButton={true}
      />
    </div>
  );
}
