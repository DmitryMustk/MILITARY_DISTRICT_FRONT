import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Opportunity, OpportunityApplication, OpportunityApplicationStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

type Prp = {
  application: OpportunityApplication;
  projectIsBanned: boolean;
  projectIsDraft: boolean;
  projectIsOnModeration: boolean;
  opportunity: Opportunity;
};

function getVariant(status: OpportunityApplicationStatus): 'default' | 'destructive' | 'secondary' {
  switch (status) {
    case 'archived':
      return 'secondary';
    case 'archivedByArtist':
      return 'secondary';
    case 'new':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    case 'sent':
      return 'secondary';
    case 'shortlisted':
      return 'default';
    case 'viewlater':
      return 'secondary';
  }
}

export function ApplicationCard({
  application,
  opportunity,
  projectIsBanned,
  projectIsDraft,
  projectIsOnModeration,
}: Prp) {
  const t = useTranslations('Component.ApplicationCard');
  return (
    <Card key={application.id} className="border-none flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>
            {t('applicationTo')} {opportunity.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h6 className="font-semibold font-archivo">{t('message')}</h6>
            <p className="whitespace-pre-wrap truncate">{application.message}</p>
          </div>
          <div>
            <h6 className="font-semibold font-archivo">{t('status')}</h6>
            <div className="flex gap-2 pt-2">
              <Badge variant={getVariant(application.status)}>{application.status}</Badge>
              {projectIsBanned && <Badge variant="destructive">{t('projectIsBanned')}</Badge>}
              {projectIsDraft && <Badge variant="destructive">{t('projectIsDraft')}</Badge>}
              {projectIsOnModeration && <Badge variant="destructive">{t('projectIsOnModeration')}</Badge>}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button asChild>
          <Link href={`/artist/applications/edit/${application.id}`}>{t('edit')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
