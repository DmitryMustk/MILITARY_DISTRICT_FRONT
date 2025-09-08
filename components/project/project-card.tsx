import { $Enums, Project } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { PropsWithChildren } from 'react';
import { Badge } from '../ui/badge';
import { Attachment } from '@/lib/types';
import { downloadUrl } from '@/lib/mongo/download-url';
import { getTranslations } from 'next-intl/server';
import { AttachmentViewList, ImageAttachmentView } from '../common/attachments';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExpandableText from '../common/expandable-text';

interface ProjectCardProps extends PropsWithChildren {
  project: Project;
  limitSize?: boolean;
}

export async function ProjectCard({ project, children, limitSize }: ProjectCardProps) {
  const t = await getTranslations('Component.ProjectCard');
  const imageId = (project.posterImage as Attachment)?.value?.id ?? undefined;

  return (
    <Card key={project.id} className="border-none flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className={limitSize ? 'line-clamp-3' : ''}>{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imageId && (
            <ImageAttachmentView maxHeight={350} fileName={'Project image'} downloadUrl={downloadUrl(imageId)} />
          )}
          {project.moderationStatus === $Enums.ModerationStatus.Denied && (
            <div>
              <h6 className="font-semibold font-archivo">{t('reviewMessage')}</h6>
              <p>{project.moderationComment}</p>
            </div>
          )}
          <div>
            <h6 className="font-semibold font-archivo">{t('description')}</h6>
            {limitSize ? (
              <p className="mt-2 mb-2 line-clamp-3 whitespace-pre-wrap truncate">{project.description}</p>
            ) : (
              <ExpandableText text={project.description} />
            )}
          </div>
          {project.link && (
            <div>
              <h6 className="font-semibold font-archivo">{t('link')}</h6>
              <a
                target="_blank"
                className={cn('text-gray-50 hover:text-blue', { '[&:nth-child(n+5)]:hidden': limitSize })}
                href={project.link}
              >
                <div>{project.link}</div>
              </a>
              {limitSize && <MoreHorizontal className="hidden [&:nth-child(n+6)]:inline" />}
            </div>
          )}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h6 className="font-semibold font-archivo">Tags</h6>
              <li className="flex gap-1 flex-wrap">
                {project.tags.map((tag, idx) => (
                  <Badge variant={'secondary'} key={idx} className={limitSize ? '[&:nth-child(n+20)]:hidden' : ''}>
                    {tag}
                  </Badge>
                ))}
                {limitSize && <MoreHorizontal className={limitSize ? 'hidden [&:nth-child(n+21)]:inline' : ''} />}
              </li>
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
      </div>
      <CardFooter className="flex gap-2 flex-wrap">{children}</CardFooter>
    </Card>
  );
}

export default ProjectCard;
