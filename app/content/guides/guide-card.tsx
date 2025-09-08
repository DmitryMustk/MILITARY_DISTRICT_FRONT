import { Guide, ResourceType } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/date-format';
import { AttachmentView } from '@/components/common/attachments';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ServerActionButton } from '@/components/common/server-action-button';
import React from 'react';
import { deleteGuide } from '@/lib/content/guide/action';

type Prp = {
  guide: Guide;
};

export function GuideCard({ guide }: Prp) {
  const t = useTranslations('Component.GuideCard');

  const resource = typeof guide.resource === 'string' ? JSON.parse(guide.resource) : guide.resource || {};

  const file = resource.file?.value;
  const link = resource.url;

  return (
    <Card key={guide.id} className="flex flex-col gap-2 relative">
      <CardHeader>
        <CardTitle className="min-h-5 truncate">{guide.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>{formatDate(guide.createdAt)}</div>

        {guide.resourceType == ResourceType.LINK && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {link}
          </a>
        )}
        {guide.resourceType == ResourceType.FILE && (
          <AttachmentView fileName={file.fileName} fileType={file.fileType} id={file.id} maxHeight={200} />
        )}
      </CardContent>

      <CardFooter className="bottom-10">
        <Button asChild>
          <Link href={`/content/guides/edit/${guide.id}`}>{t('editButton')}</Link>
        </Button>
        <ServerActionButton variant={`destructive`} serverAction={deleteGuide} actionArgs={[guide.id]} refreshAfter>
          {t('deleteButton')}
        </ServerActionButton>
      </CardFooter>
    </Card>
  );
}
