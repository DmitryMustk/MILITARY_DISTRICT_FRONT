'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChangeEvent, useCallback, useId, useState } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArtistCardHeader } from '@/components/artist/artist-card-header';
import { useTranslations } from 'next-intl';
import { Artist, Opportunity } from '@prisma/client';
import { OpportunityCardHeader } from '@/components/opportunities/opportunity-card-header';

interface OpportunityInviteMessageCardProps {
  invite: { message: string };
  inviteId: number;
  artist?: Artist;
  opportunity?: Opportunity;

  onMessageChange(artistId: number, message: string): void;
  onInviteRemove(artistId: number): void;
}

export function OpportunityInviteMessageCard({
  invite,
  onMessageChange,
  onInviteRemove,
  inviteId,
  artist,
  opportunity,
}: OpportunityInviteMessageCardProps) {
  const id = useId();
  const t = useTranslations('Component.OpportunityInviteMessageCard');

  const [custom, setCustom] = useState<CheckedState>(invite.message !== '');

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => onMessageChange(inviteId, e.target.value),
    [inviteId, onMessageChange]
  );

  const handleRemove = useCallback(() => onInviteRemove(inviteId), [inviteId, onInviteRemove]);

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      setCustom(checked);
      if (!checked) {
        onMessageChange(inviteId, '');
      }
    },
    [onMessageChange, inviteId]
  );

  return (
    <Card className="flex flex-col justify-between">
      <div>
        {artist && <ArtistCardHeader artist={artist} />}
        {opportunity && <OpportunityCardHeader opportunity={opportunity} />}
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Checkbox id={id} checked={custom} onCheckedChange={handleCheckedChange} />
            <Label htmlFor={id}>{t('customMessage')}</Label>
          </div>
          {custom && <Textarea value={invite.message} onChange={handleMessageChange} rows={6} />}
        </CardContent>
      </div>
      <CardFooter>
        <Button variant="outline" onClick={handleRemove}>
          {t('cancel')}
        </Button>
      </CardFooter>
    </Card>
  );
}
