'use client';

import { Opportunity } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { ArtistOpportunityInviteFormItem } from './types';
import { OpportunityInviteOpportunityCard } from './opportunity-invite-opportunity-card';

interface OpportunityInviteOpportunityStepProps {
  opportunities: (Opportunity & { alreadyInvited: boolean })[];
  invites: ArtistOpportunityInviteFormItem[];

  onInviteToggle(opportunity: number): void;
}

export function OpportunityInviteOpportunityStep({
  opportunities,
  invites,
  onInviteToggle,
}: OpportunityInviteOpportunityStepProps) {
  const t = useTranslations('Component.OpportunityInviteOpportunityStep');

  return (
    <div className="space-y-4">
      <h2>{t('selectOpportunity')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <OpportunityInviteOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            invited={invites.some((invite) => invite.opportunity.id === opportunity.id)}
            onInviteToggle={onInviteToggle}
          />
        ))}
      </div>
    </div>
  );
}
