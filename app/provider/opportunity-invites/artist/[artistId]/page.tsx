import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { OpportunityInviteCard } from '../../opportunity-invite-card';
import { ArtistCardHeader } from '@/components/artist/artist-card-header';
import { getOpportunityInvitesArtist } from '@/lib/opportunity/invite/queries';

export default async function OpportunityInvitesArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const { artist, invites } = await getOpportunityInvitesArtist(parseInt(artistId));
  const t = await getTranslations('Page.OpportunityInvitesArtistPage');

  return (
    <div className="space-y-4 md:px-32 py-8">
      <div>
        <ArtistCardHeader artist={artist} />
        <div className="space-y-2">
          {invites.length === 0 && <p>{t('noInvitesFound')}</p>}
          {invites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invites.map((invite) => (
                <OpportunityInviteCard key={invite.id} invite={invite} opportunity={invite.opportunity} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild>
            <Link href={`/provider/opportunity-invites/artist/${artistId}/create`}>{t('addOpportunityInvite')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/artists`}>{t('backArtists')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
