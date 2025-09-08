import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

import { PieChart } from '@/components/admin/dashboard/pie-chart';
import { getProviderDashboardStats } from '@/lib/admin/queries';

export default async function ProviderOverviewCard() {
  const t = await getTranslations('Component.ProviderOverviewCard');
  const stats = await getProviderDashboardStats();

  const averageOpportunities = stats.providersCount
    ? Number((stats.opportunitiesCount / stats.providersCount).toFixed(2))
    : 0;
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{t('registeredProvidersCount')}</h3>
            <p>{stats.providersCount}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('opportunitiesCount')}</h3>
            <p>{stats.opportunitiesCount}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('averageOpportunities')}</h3>
            <p>{averageOpportunities}</p>
          </div>
          <div>
            <PieChart data={stats.opportunitiesByType} title={t('opportunitiesByType')} />
          </div>
          <div>
            <h3 className="font-semibold">{t('providerInvitesCount')}</h3>
            <p>{stats.providerInvitesCount}</p>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
