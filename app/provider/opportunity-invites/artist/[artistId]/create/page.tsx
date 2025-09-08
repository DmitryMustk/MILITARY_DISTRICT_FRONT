import { getArtist } from '@/lib/artist/queries';
import { getTranslations } from 'next-intl/server';
import ArtistOpportunityInviteForm from './artist-opportunity-invite-form';
import { getMyOpportunitiesWithInvites } from '@/lib/opportunity/invite/queries';

export default async function ArtistOpportunityCreateInvitesPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const t = await getTranslations('Page.ArtistOpportunityCreateInvitesPage');

  const { artistId } = await params;
  const artist = await getArtist(artistId);
  const parsedArtistId = parseInt(artistId);
  const name = artist.artistName
    ? artist.artistName
    : artist.firstName || artist.lastName
      ? `${artist.firstName ?? ''} ${artist.lastName ?? ''}`
      : t('unknown');

  const data = await getMyOpportunitiesWithInvites();
  const opportunities = data.map((opportunity) => ({
    ...opportunity,
    alreadyInvited: opportunity.invites.some((invite) => invite.artistId === parsedArtistId),
  }));

  return (
    <div className="md:px-32 py-8">
      <div>
        <h1 className="font-bold mb-6">{name}</h1>
        <ArtistOpportunityInviteForm opportunities={opportunities} artistId={parsedArtistId} />
      </div>
    </div>
  );
}
