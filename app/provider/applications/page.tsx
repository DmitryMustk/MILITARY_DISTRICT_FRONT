import {
  getProviderApplications,
  OpportunityApplicationQuerySearchParams,
} from '@/lib/opportunity-application/queries';
import { getTranslations } from 'next-intl/server';
import { ProviderOpportunityApplicationSearchForm } from './application-search-form';
import { getMyOpportunities } from '@/lib/opportunity/queries';
import { ProviderApplicationCard } from './provider-application-card';

export type ProviderOpportunityApplicationsParams = {
  opportunities?: string;
  applicationStatus?: string;
  applicationMessage?: string;
  projectDescription?: string;
  applicantName?: string;
  showBlock?: string;
};

export default async function ProviderOpportunityApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<ProviderOpportunityApplicationsParams>;
}) {
  const params = await searchParams;
  const decodedStatuses = params.applicationStatus
    ? decodeURIComponent(params.applicationStatus).split(',')
    : undefined;
  const decodedOpportunities = params.opportunities
    ? decodeURIComponent(params.opportunities)
        .split(',')
        .map((val) => parseInt(val))
    : undefined;
  const applicationSearchRequest = {
    ...params,
    applicationStatus: decodedStatuses,
    opportunities: decodedOpportunities,
    showBlock: params.showBlock === 'true',
  } as OpportunityApplicationQuerySearchParams;

  const { blockedArtists, applications } = await getProviderApplications(applicationSearchRequest);
  const opportunities = await getMyOpportunities();
  const t = await getTranslations('Page.ProviderOpportunityApplicationsPage');

  return (
    <div className="space-y-8">
      <h1 className="font-bold">{t('opportunityApplications')}</h1>
      <ProviderOpportunityApplicationSearchForm opportunities={opportunities} />
      {!!applications.length && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application, idx) => (
            <ProviderApplicationCard
              key={`${idx}-${application.id}`}
              application={application}
              blockedArtists={blockedArtists}
            />
          ))}
        </div>
      )}
    </div>
  );
}
