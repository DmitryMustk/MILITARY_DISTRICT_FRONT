import { Button } from '@/components/ui/button';
import Link from 'next/link';
import OpportunityCard from '@/components/opportunities/opportunity-card';
import { getMyOpportunities } from '@/lib/opportunity/queries';
import { getTranslations } from 'next-intl/server';
import { isOpportunityValidToInvite } from '@/lib/opportunity/utils';

export default async function MyOpportunitiesPage() {
  const opportunities = await getMyOpportunities();
  const t = await getTranslations('Page.MyOpportunitiesPage');

  return (
    <div>
      <h1 className="font-bold mb-6">{t(`header`)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} footerStyles="block" showAttachment>
            {!isOpportunityValidToInvite(opportunity) && (
              <div className="bg-warn p-[10px] rounded-sm mb-2">{t('inviteWarning')}</div>
            )}
            <div className="flex gap-2 flex-wrap">
              <Button asChild>
                <Link href={`/provider/applications?opportunities=${opportunity.id}`}>{t('applications')}</Link>
              </Button>
              <Button asChild>
                <Link href={`/provider/opportunities/edit/${opportunity.id}`}>{t('update')}</Link>
              </Button>
              {isOpportunityValidToInvite(opportunity) && (
                <Button asChild>
                  <Link href={`/provider/opportunity-invites/opportunity/${opportunity.id}`}>{t('invite')}</Link>
                </Button>
              )}
            </div>
          </OpportunityCard>
        ))}
      </div>
      <div className="py-4">
        <Button asChild>
          <Link href={`/provider/opportunities/create`}>{t('createOpportunity')}</Link>
        </Button>
      </div>
    </div>
  );
}
