'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCallback, useId } from 'react';
import { Artist } from '@prisma/client';
import { ArtistCardHeader } from '@/components/artist/artist-card-header';
import { useTranslations } from 'next-intl';

interface OpportunityInviteArtistCardProps {
  artist: Artist & { alreadyInvited: boolean };
  invited: boolean;

  onInviteToggle(artistId: number): void;
}

export function OpportunityInviteArtistCard({ artist, invited, onInviteToggle }: OpportunityInviteArtistCardProps) {
  const handleInviteToggle = useCallback(() => onInviteToggle(artist.id), [artist.id, onInviteToggle]);
  const id = useId();
  const t = useTranslations('Component.OpportunityInviteArtistCard');

  return (
    <Card>
      <ArtistCardHeader artist={artist} />
      <CardContent>
        {artist.alreadyInvited && <div className="text-sm text-gray-70">{t('alreadyInvited')}</div>}
        {!artist.alreadyInvited && (
          <div className="flex gap-2 items-center">
            <Checkbox id={id} checked={invited} onCheckedChange={handleInviteToggle} />
            <Label htmlFor={id}>Invite</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
