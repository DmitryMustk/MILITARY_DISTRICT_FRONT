'use client';

import { $Enums, Project } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { deleteProject, sendConfirmProject } from '@/lib/project/action';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Attachment } from '@/lib/types';
import { downloadUrl } from '@/lib/mongo/download-url';
import { AttachmentViewList, ImageAttachmentView } from '../common/attachments';

interface ArtistProjectCardProps {
  project: Project & { hasApplications: boolean };
}

const ArtistProjectCard: React.FC<ArtistProjectCardProps> = ({ project }) => {
  const t = useTranslations('Component.ArtistProjectCard');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const imageId = useMemo(() => (project.posterImage as Attachment)?.value?.id ?? undefined, [project.posterImage]);

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const projectStatus = useMemo(() => {
    if (project.hidden) {
      return t('hiddenStatus');
    }
    switch (project.moderationStatus) {
      case 'Approved': {
        return t('approvedStatus');
      }
      case 'Draft': {
        return t('draftStatus');
      }
      case 'Denied': {
        return t('deniedStatus');
      }
      case 'OnModeration': {
        return t('onModerationStatus');
      }
    }
  }, [project.moderationStatus, project.hidden, t]);

  const handleDelete = useCallback(async () => {
    startTransition(async () => {
      await deleteProject(project.id);

      router.refresh();
      toast({
        title: t('projectDeleted'),
      });
    });
  }, [project.id, router, toast, t]);

  const handleSendConfirm = useCallback(async () => {
    startTransition(async () => {
      await sendConfirmProject(project.id);

      router.refresh();
      toast({
        title: t('projectSubmittedReview'),
      });
    });
  }, [project.id, toast, router, t]);

  return (
    <Card key={project.id} className="border-none">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageId && (
          <ImageAttachmentView maxHeight={350} fileName={'Project image'} downloadUrl={downloadUrl(imageId)} />
        )}
        <div>
          <h6 className="font-semibold font-archivo">{t('status')}</h6>
          {project.banned ? (
            <Badge variant={'destructive'}>{t(`bannedStatus`)}</Badge>
          ) : (
            <Badge variant={'secondary'}>{projectStatus}</Badge>
          )}
        </div>
        {project.moderationStatus === $Enums.ModerationStatus.Denied && (
          <div>
            <h6 className="font-semibold font-archivo">{t('reviewMessage')}</h6>
            <p>{project.moderationComment}</p>
          </div>
        )}
        <div>
          <h6 className="font-semibold font-archivo">{t('description')}</h6>
          <p className="whitespace-pre-wrap truncate">{project.description}</p>
        </div>
        {project.link && (
          <div>
            <h6 className="font-semibold font-archivo">{t('link')}</h6>
            <a target="_blank" className="text-gray-50 hover:text-blue" href={project.link}>
              {project.link}
            </a>
          </div>
        )}
        {project.tags && project.tags.length > 0 && (
          <div>
            <h6 className="font-semibold font-archivo">{t('tags')}</h6>
            <div className="flex gap-1 flex-wrap">
              {project.tags.map((tag, idx) => (
                <Badge variant={'secondary'} key={idx}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div>
          <h6 className="font-semibold font-archivo">{t('budget')}</h6>
          <Badge variant={'secondary'}>{`${project.budget} $`}</Badge>
        </div>
        <div>
          <h6 className="font-semibold font-archivo">{t('reach')}</h6>
          <Badge variant={'secondary'}>{project.reach}</Badge>
        </div>
        {project.attachments && (project.attachments as Attachment[]).length > 0 && (
          <AttachmentViewList attachments={project.attachments as Attachment[]} />
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button asChild variant={'outline'} disabled={pending}>
          <Link href={`/artist/projects/edit/${project.id}`}>{t('update')}</Link>
        </Button>
        {project.moderationStatus === $Enums.ModerationStatus.Draft && (
          <Button variant="outline" onClick={handleSendConfirm} disabled={pending}>
            {t('sendToModeration')}
          </Button>
        )}
        {showDeleteConfirmation ? (
          <div className="flex gap-4 flex-wrap">
            <Button type="button" variant={'destructive'} onClick={handleDelete}>
              {t('deleteConfirm')}
            </Button>
            <Button type="button" variant={'outline'} onClick={() => setShowDeleteConfirmation(false)}>
              {t('deleteCancel')}
            </Button>
            {project.hasApplications && (
              <div className="flex self-center bg-warn w-fit p-[10px] rounded-sm">
                {t('projectWithApplicationsWarning')}
              </div>
            )}
          </div>
        ) : (
          <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirmation(true)}>
            {t('deleteLabel')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ArtistProjectCard;
