'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCallback, useId } from 'react';
import { Opportunity } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { OpportunityCardHeader } from '@/components/opportunities/opportunity-card-header';

interface OpportunityInviteOpportunityCard {
  opportunity: Opportunity & { alreadyInvited: boolean };
  invited: boolean;

  onInviteToggle(artistId: number): void;
}

export function OpportunityInviteOpportunityCard({
  opportunity,
  invited,
  onInviteToggle,
}: OpportunityInviteOpportunityCard) {
  const handleInviteToggle = useCallback(() => onInviteToggle(opportunity.id), [opportunity.id, onInviteToggle]);
  const id = useId();
  const t = useTranslations('Component.OpportunityInviteOpportunityCard');

  return (
    <Card className="flex flex-col justify-between">
      <OpportunityCardHeader opportunity={opportunity} />
      <CardContent>
        {opportunity.alreadyInvited && <div className="text-sm text-gray-70">{t('alreadyInvited')}</div>}
        {!opportunity.alreadyInvited && (
          <div className="flex gap-2 items-center">
            <Checkbox id={id} checked={invited} onCheckedChange={handleInviteToggle} />
            <Label htmlFor={id}>Invite</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
