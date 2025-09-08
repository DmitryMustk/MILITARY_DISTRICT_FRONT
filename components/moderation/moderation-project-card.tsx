import { Project } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import Link from 'next/link';

export const ModerationProjectCard = async ({ project }: { project: Project }) => {
  const t = await getTranslations('Component.ModerationProjectCard');

  return (
    <Link href={`/moderation/project/${project.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{t('description')}</h3>
            <p className="line-clamp-3 whitespace-pre-wrap truncate">{project.description}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('updated')}</h3>
            <p className="line-clamp-3">{project.updatedAt.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
