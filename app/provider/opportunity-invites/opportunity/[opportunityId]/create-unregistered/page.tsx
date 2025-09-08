import { getMyOpportunity } from '@/lib/opportunity/queries';
import { OpportunityInviteUnregisteredForm } from './opportunity-invite-unregistered-form';

export default async function OpportunityCreateInvitesUnregisteredArtistPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;

  const opportunity = await getMyOpportunity(parseInt(opportunityId));

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-[calc(100vh-200px)]">
      <h1 className="font-bold mb-6 leading-10">{opportunity.title}</h1>
      <OpportunityInviteUnregisteredForm opportunityId={parseInt(opportunityId)} />
    </div>
  );
}
