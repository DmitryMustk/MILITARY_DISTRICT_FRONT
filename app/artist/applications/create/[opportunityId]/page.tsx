import OpportunityCard from '@/components/opportunities/opportunity-card';
import { getAvailableOpportunity } from '@/lib/opportunity/queries';
import OpportunityApplicationForm from '../../application-form';
import { auth } from '@/lib/auth';
import { forbidden, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { OpportunityApplicationFormValues } from '@/lib/opportunity-application/types';
import { getMyApplications, getProjectsWithoutApplications } from '@/lib/opportunity-application/queries';
import { getMyModerationStatus } from '@/lib/artist/queries';

const defaultValues: OpportunityApplicationFormValues = {
  message: '',
  attachments: [],
};

export default async function OpportunityApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ opportunityId: string }>;
  searchParams: Promise<{ referer?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (!session.user.artistId) {
    forbidden();
  }

  const myStatus = await getMyModerationStatus();
  const t = await getTranslations('Page.OpportunityApplicationPage');
  const opportunityId = Number.parseInt((await params).opportunityId);
  const referer = (await searchParams).referer;

  const [opportunity, projectsWithoutApplication] = await Promise.all([
    getAvailableOpportunity(opportunityId),
    getProjectsWithoutApplications(opportunityId),
  ]);
  const applicationWithoutProject = await getMyApplications(opportunityId, null, undefined);
  const limitExceeded = !projectsWithoutApplication.length && applicationWithoutProject.length > 0;

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold">{t('youApplyingTo')}</h1>
      <div className="max-w-[80vw]">
        {limitExceeded && <p className="mb-2 text-lg text-red">{t('tooMuchApplications')}</p>}
        <OpportunityCard
          opportunity={opportunity}
          showAttachment
          className="m-auto max-w-[590px] py-0"
          footerStyles="!py-0"
        />
        {!limitExceeded && (
          <OpportunityApplicationForm
            opportunityId={opportunityId}
            defaultValues={defaultValues}
            projects={projectsWithoutApplication}
            hasApplicationWithoutProject={applicationWithoutProject.length > 0}
            referer={referer}
            blockSending={myStatus !== 'Approved'}
          />
        )}
      </div>
    </div>
  );
}
