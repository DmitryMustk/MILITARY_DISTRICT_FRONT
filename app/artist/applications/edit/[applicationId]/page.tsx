import OpportunityCard from '@/components/opportunities/opportunity-card';
import OpportunityApplicationForm from '../../application-form';
import { getMyModerationStatus } from '@/lib/artist/queries';

import {
  getMyApplication,
  getMyApplications,
  getProjectsWithoutApplications,
} from '@/lib/opportunity-application/queries';
import { getTranslations } from 'next-intl/server';
import { AttachmentWithType } from '@/lib/types';
import { getMyProject } from '@/lib/project/queries';

export default async function EditOpportunityApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const t = await getTranslations('Page.EditOpportunityApplicationPage');
  const applicationId = parseInt((await params).applicationId);
  const myStatus = await getMyModerationStatus();

  const application = await getMyApplication(applicationId);
  const [selectedProject, allProjects] = await Promise.all([
    application.projectId ? getMyProject(application.projectId.toString()) : Promise.resolve(null),
    getProjectsWithoutApplications(application.opportunityId),
  ]);
  if (selectedProject) {
    allProjects.push(selectedProject);
  }
  const applicationsWithoutProject = (await getMyApplications(application.opportunityId, null, undefined)).filter(
    (application) => application.id != applicationId
  );

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold">{t('youApplyingTo')}</h1>
      <div className="max-w-[80vw]">
        <OpportunityCard
          opportunity={application.opportunity}
          showAttachment
          className="m-auto max-w-[590px] !py-0"
          footerStyles="!py-0"
        />
        <OpportunityApplicationForm
          application={application}
          projects={allProjects}
          defaultValues={{
            ...application,
            projectId: application.projectId === null ? undefined : application.projectId.toString(),
            attachments: application.attachments as AttachmentWithType[],
          }}
          hasApplicationWithoutProject={applicationsWithoutProject.length > 0}
          referer={'/artist/applications'}
          blockSending={myStatus !== 'Approved'}
        />
      </div>
    </div>
  );
}
