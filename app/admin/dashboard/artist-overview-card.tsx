import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { PieChart } from '@/components/admin/dashboard/pie-chart';
import BarChart from '@/components/admin/dashboard/bar-chart';
import { getArtistStatisticsForDashboard } from '@/lib/admin/queries';

export default async function ArtistOverviewCard() {
  const t = await getTranslations('Component.ArtistOverviewCard');
  const stats = await getArtistStatisticsForDashboard();

  const averageProjects = stats.artistCount ? Number((stats.projectsCount / stats.artistCount).toFixed(2)) : 0;
  const percentageChange = stats.newLastMonth
    ? (((stats.newThisMonth - stats.newLastMonth) / stats.newLastMonth) * 100).toFixed(1)
    : '';
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{t('registeredArtistsCount')}</h3>
            <p>{stats.artistCount}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('projectsCount')}</h3>
            <p>{stats.projectsCount}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('averageProjects')}</h3>
            <p>{averageProjects}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('openApplicationsCount')}</h3>
            <p>{stats.openApplicationCount}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('submittedApplications')}</h3>
            <p>{stats.submittedApplicationCount}</p>
          </div>
          <div>
            <PieChart data={stats.artistsByIndustry} title={t('artistsByIndustry')} />
          </div>
          <div>
            <BarChart data={stats.artistsByCountry} title={t('artistsByCountry')} />
          </div>
          <div>
            <h3 className="font-semibold">{t('newRegistrationsTitle')}</h3>
            <p className="whitespace-pre-line">{t('newRegistrations', { registrationCount: stats.newThisMonth })}</p>
            {percentageChange && <p>{t('newRegistrationsPercentageChange', { percentageChange: percentageChange })}</p>}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
