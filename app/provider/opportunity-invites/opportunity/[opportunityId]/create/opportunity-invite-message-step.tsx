'use client';

import { ChangeEvent, useCallback, useId } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OpportunityInviteFormItem } from './types';
import { useTranslations } from 'next-intl';
import { OpportunityInviteMessageCard } from '../../../opportunity-invite-message-card';

interface OpportunityInviteMessageStepProps {
  invites: OpportunityInviteFormItem[];
  message: string;

  onMessageChange(message: string): void;
  onCustomMessageChange(artistId: number, message: string): void;
  onInviteRemove(artistId: number): void;
}

export function OpportunityInviteMessageStep({
  invites,
  message,
  onMessageChange,
  onCustomMessageChange,
  onInviteRemove,
}: OpportunityInviteMessageStepProps) {
  const messageId = useId();
  const t = useTranslations('Component.OpportunityInviteMessageStep');

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => onMessageChange(e.target.value),
    [onMessageChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invites.map((invite) => (
          <OpportunityInviteMessageCard
            key={invite.artist.id}
            artist={invite.artist}
            invite={invite}
            inviteId={invite.artist.id}
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
