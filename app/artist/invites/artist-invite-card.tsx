import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Opportunity, OpportunityInvite, OpportunityInviteStatus } from '@prisma/client';
import { useTranslations, useFormatter } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface ArtistInviteCardProps {
  invite: OpportunityInvite & { opportunity: Opportunity };
}

function getVariant(status: OpportunityInviteStatus): 'default' | 'destructive' | 'outline' | 'secondary' {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'accepted':
      return 'secondary';
    case 'rejected':
      return 'destructive';
  }
}

export function ArtistInviteCard({ invite }: ArtistInviteCardProps) {
  const t = useTranslations('Component.ArtistInviteCard');
  const f = useFormatter();
  const tOpportunityType = useTranslations('Enum.OpportunityType');

  return (
    <Card key={invite.id} className="border-none flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="line-clamp-3">{invite.opportunity.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h6 className="font-semibold font-archivo">{t('opportunityType')}</h6>
            <Badge variant="secondary">{tOpportunityType(invite.opportunity.type)}</Badge>
          </div>
          <div>
            <h6 className="font-semibold font-archivo">{t('status')}</h6>
            <Badge variant={getVariant(invite.status)}>{invite.status}</Badge>
          </div>
          <div>
            <h6 className="font-semibold font-archivo">{t('message')}</h6>
            <p className="whitespace-pre-wrap truncate">{invite.message}</p>
          </div>
          <div>
            <h6 className="font-semibold font-archivo">{t('description')}</h6>
            <p className="whitespace-pre-wrap truncate">{invite.opportunity.description}</p>
          </div>
          <div>
            <h6 className="font-semibold font-archivo">{t('applicationDeadline')}</h6>
            <p>{`${invite.opportunity.applicationDeadline.toLocaleDateString()}`}</p>
          </div>
          {invite.opportunity.responseDeadline && (
            <div>
              <h6 className="font-semibold font-archivo">{t('responseDeadline')}</h6>
              <p>{`${invite.opportunity.responseDeadline.toLocaleDateString()}`}</p>
            </div>
          )}
          {invite.opportunity.type === 'grant' &&
            (invite.opportunity.minGrantAmount !== null || invite.opportunity.maxGrantAmount !== null) && (
              <div>
                <h6 className="font-semibold font-archivo">{t('budget')}</h6>
                {invite.opportunity.minGrantAmount !== null && (
                  <p>{`${t('from')} ${f.number(invite.opportunity.minGrantAmount, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  })}`}</p>
                )}
                {invite.opportunity.maxGrantAmount !== null && (
                  <p>{`${t('to')} ${f.number(invite.opportunity.maxGrantAmount, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  })}`}</p>
                )}
              </div>
            )}
          {invite.opportunity.type === 'residency' && (
            <div>
              <h6 className="font-semibold font-archivo">{t('period')}</h6>
              <p>{t(`fromWeeks`, { weeks: invite.opportunity.minResidencyTime })}</p>
              <p>{t(`toWeeks`, { weeks: invite.opportunity.maxResidencyTime })}</p>
              {invite.opportunity.residencyOffering.length !== 0 && (
                <div className="flex gap-1 flex-wrap">
                  {invite.opportunity.residencyOffering.map((e) => (
                    <Badge variant={'secondary'} key={e}>
                      {e}
                    </Badge>
                  ))}
                </div>
              )}
              {!!invite.opportunity.residencyOfferingDescription && (
                <p className="mt-2 mb-2 line-clamp-3">{invite.opportunity.residencyOfferingDescription}</p>
              )}
            </div>
          )}
          {invite.opportunity.type === 'award' && (
            <div>
              <h6 className="font-semibold font-archivo">{t('award')}</h6>
              {invite.opportunity.minAwardAmount !== null && (
                <p>{`${t('from')} ${f.number(invite.opportunity.minAwardAmount, {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}`}</p>
              )}
              {invite.opportunity.maxAwardAmount !== null && (
                <p>{`${t('to')} ${f.number(invite.opportunity.maxAwardAmount, {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}`}</p>
              )}
              {!!invite.opportunity.awardSpecialAccess && (
                <p className="mt-2 mb-2 line-clamp-3">{invite.opportunity.awardSpecialAccess}</p>
              )}
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button asChild>
          <Link href={`/artist/applications/create/${invite.opportunityId}`}>{t('createOpportunityApplication')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
