import { SearchPagination, SearchPaginationSearchParams } from '@/components/common/search-pagination';
import { getTranslations } from 'next-intl/server';
import OpportunityCard from '@/components/opportunities/opportunity-card';
import { ServerActionButton } from '@/components/common/server-action-button';

import { getBannedOpportunitiesPage, setOpportunityBanned } from '@/lib/admin/opportunity-management';

const OPPORTUNITIES_PER_PAGE = 6;

export default async function BannedOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchPaginationSearchParams>;
}) {
  const t = await getTranslations('Page.BannedOpportunitiesPage');

  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) : 1;

  const [opportunities, count] = await getBannedOpportunitiesPage(page, OPPORTUNITIES_PER_PAGE);

  return (
    <div>
      <h1 className="font-bold mb-6">{t('header')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            disableBannedBadge={true}
            provider={opportunity.provider.organizationName}
            showAttachment
          >
            <ServerActionButton serverAction={setOpportunityBanned} actionArgs={[opportunity.id, false]} refreshAfter>
              {t(`restore`)}
            </ServerActionButton>
          </OpportunityCard>
        ))}
      </div>
      <SearchPagination currentPage={page} pagesTotal={Math.ceil(count / OPPORTUNITIES_PER_PAGE)} />
    </div>
  );
}
