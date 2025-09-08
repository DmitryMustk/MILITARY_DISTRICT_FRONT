import { getArtistOpportunityInvites } from '@/lib/opportunity/invite/queries';
import { getTranslations } from 'next-intl/server';
import { ArtistInviteCard } from './artist-invite-card';

export default async function ArtistsInvitesPage() {
  const invites = await getArtistOpportunityInvites();
  const t = await getTranslations('Page.ArtistsInvitesPage');

  return (
    <div className="space-y-8 mx-4">
      <h1 className="font-bold">{t('invites')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invites.map((invite, idx) => (
          <ArtistInviteCard key={idx} invite={invite} />
        ))}
      </div>
    </div>
  );
}
