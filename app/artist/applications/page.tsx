import { getMyApplications } from '@/lib/opportunity-application/queries';
import { ApplicationCard } from '@/app/artist/applications/application-card';
import { OpportunityApplicationStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { getMyModerationStatus } from '@/lib/artist/queries';
import { ApplicationSearchForm } from '@/app/artist/applications/application-search-form';

export default async function OpportunityApplicationsPage({ searchParams }: { searchParams: Promise<{ st: string }> }) {
  //this page is for artists:
  const myStatus = await getMyModerationStatus();

  const status = (await searchParams).st as OpportunityApplicationStatus;
  const t = await getTranslations('Page.OpportunityApplicationsPage');

  const applications = await getMyApplications(undefined, undefined, status);

  return (
    <div className="mx-4">
      <h1 className="font-bold">{t('myApplication')}</h1>
      {myStatus === 'Draft' && <h4 className="text-red">{t('draftProfileWarning')}</h4>}
      {myStatus === 'OnModeration' && <h4 className="text-red">{t('profileOnModerationWarning')}</h4>}
      <div className="flex gap-2 pb-2 mt-6">
        <ApplicationSearchForm initialValue={status} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            opportunity={application.opportunity}
            projectIsBanned={!!application.project?.banned}
            projectIsDraft={application.project?.moderationStatus === 'Draft'}
            projectIsOnModeration={application.project?.moderationStatus === 'OnModeration'}
          />
        ))}
      </div>
    </div>
  );
}
