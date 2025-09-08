import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProject, ModerationEntityFilter } from '@/lib/moderation/queries';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@prisma/client';
import { ModerationSendMessageForm } from '@/components/moderation/moderation-send-message-form';
import { formatLabel, formatValue } from '@/lib/props-format';
import { Attachment } from '@/lib/types';
import { AttachmentView, ImageAttachmentView } from '@/components/common/attachments';
import React from 'react';
import { downloadUrl } from '@/lib/mongo/download-url';

type ModerationProject = Omit<
  Project,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'moderationStatus'
  | 'moderationComment'
  | 'moderatorId'
  | 'exclusiveSupport'
  | 'hidden'
  | 'artistId'
>;

const getValue = (prop: string, project: ModerationProject) => {
  if (prop === 'attachments') {
    const attachments = project[prop] as Attachment[];
    return attachments.length ? (
      <ul className="flex gap-y-2 flex-col mt-2">
        {attachments.map((a) => (
          <li key={a.value.id}>
            <AttachmentView fileName={a.value.fileName} fileType={a.value.fileType} id={a.value.id} maxHeight={300} />
          </li>
        ))}
      </ul>
    ) : (
      '-'
    );
  }

  if (prop === 'posterImage') {
    const imageId = (project[prop] as Attachment)?.value?.id;

    return imageId ? (
      <ImageAttachmentView maxHeight={350} fileName={'Project image'} downloadUrl={downloadUrl(imageId)} />
    ) : (
      '-'
    );
  }
  // return (project[prop] as Attachment[]) ? <AttachmentViewList attachments={project[prop] as Attachment[]} /> : '-';

  if (prop === 'description') {
    return (
      <p className="whitespace-pre-wrap truncate">{formatValue(project[prop as keyof ModerationProject]) || '-'}</p>
    );
  }

  return <p>{formatValue(project[prop as keyof ModerationProject]) || '-'}</p>;
};

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();

  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  const t = await getTranslations('Page.ModerationProjectPage');
  const { projectId } = await params;
  const project = await getProject(projectId);

  return (
    <div>
      <h1 className="font-bold mb-6">{t('pageTitle')}</h1>
      <Card className="mb-[20px]">
        <CardContent className="space-y-4">
          {Object.keys(project).map((prop) => (
            <div key={prop}>
              <h3 className="font-semibold">{formatLabel(prop)}</h3>
              {getValue(prop, project)}
            </div>
          ))}
        </CardContent>
      </Card>
      <ModerationSendMessageForm entity={ModerationEntityFilter.project} id={projectId} />
    </div>
  );
}
