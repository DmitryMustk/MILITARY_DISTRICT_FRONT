'use client';

import { ChangeEvent, useCallback, useId } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { ArtistOpportunityInviteFormItem } from './types';
import { OpportunityInviteMessageCard } from '../../../opportunity-invite-message-card';

interface ArtistOpportunityInviteMessageStepProps {
  invites: ArtistOpportunityInviteFormItem[];
  message: string;

  onMessageChange(message: string): void;
  onCustomMessageChange(opportunityId: number, message: string): void;
  onInviteRemove(opportunityId: number): void;
}

export function ArtistOpportunityInviteMessageStep({
  invites,
  message,
  onMessageChange,
  onCustomMessageChange,
  onInviteRemove,
}: ArtistOpportunityInviteMessageStepProps) {
  const messageId = useId();
  const t = useTranslations('Component.ArtistOpportunityInviteMessageStep');

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => onMessageChange(e.target.value),
    [onMessageChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invites.map((invite) => (
          <OpportunityInviteMessageCard
            key={invite.opportunity.id}
            invite={invite}
            inviteId={invite.opportunity.id}
            opportunity={invite.opportunity}
            onMessageChange={onCustomMessageChange}
            onInviteRemove={onInviteRemove}
          />
        ))}
      </div>
      <div className="max-w-md space-y-2">
        <Label htmlFor={messageId}>{t('message')}</Label>
        <Textarea key={messageId} value={message} onChange={handleMessageChange} rows={6} />
      </div>
    </div>
  );
}
