import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getProviderOpportunityInvites } from '@/lib/opportunity/invite/queries';
import { OpportunityInviteUnregisteredCard } from './opportunity-invite-unregistered-card';
import { OpportunityInviteCard } from '../../opportunity-invite-card';

export default async function OpportunityInvitesOpportunityPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;
  const { opportunity, invites, invitesUnregistered } = await getProviderOpportunityInvites(parseInt(opportunityId));
  const isEmpty = invites.length === 0 && invitesUnregistered.length === 0;
  const t = await getTranslations('Page.OpportunityInvitesOpportunityPage');

  return (
    <div className="flex items-center justify-center space-y-4 md:px-32 py-8 md:min-h-[calc(100vh-200px)]">
      <h1></h1>
      <div>
        <h1 className="font-bold mb-6">{opportunity.title}</h1>
        <p className="mt-2 mb-2 whitespace-pre-wrap truncate">{opportunity.description}</p>
        <div className="space-y-2">
          {isEmpty && <p className="my-4">{t('noInvitesFound')}</p>}
          {!isEmpty && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
              {invitesUnregistered.map((invite, key) => (
                <OpportunityInviteUnregisteredCard key={key} invite={{ ...invite, email: invite.artistInvite.email }} />
              ))}
              {invites.map((invite) => (
                <OpportunityInviteCard key={invite.id} invite={invite} artist={invite.artist} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href={`/provider/opportunity-invites/opportunity/${opportunityId}/create`}>{t('inviteArtists')}</Link>
          </Button>
          <Button asChild>
            <Link href={`/provider/opportunity-invites/opportunity/${opportunityId}/create-unregistered`}>
              {t('inviteUnregisteredArtists')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
