'use client';

import { Artist } from '@prisma/client';
import { OpportunityInviteFormItem } from './types';
import { OpportunityInviteArtistCard } from './opportunity-invite-artist-card';
import { useTranslations } from 'next-intl';
import { ArtistsQuerySearchParams } from '@/lib/artist/queries';

interface OpportunityInviteArtistStepProps {
  artists: (Artist & { alreadyInvited: boolean })[];
  searchParams: ArtistsQuerySearchParams;
  invites: OpportunityInviteFormItem[];

  onInviteToggle(artistId: number): void;
}

export function OpportunityInviteArtistStep({ artists, invites, onInviteToggle }: OpportunityInviteArtistStepProps) {
  const t = useTranslations('Component.OpportunityInviteArtistStep');

  return (
    <div className="space-y-4">
      <h2>{t('selectArtists')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <OpportunityInviteArtistCard
            key={artist.id}
            artist={artist}
            invited={invites.some((invite) => invite.artist.id === artist.id)}
            onInviteToggle={onInviteToggle}
          />
        ))}
      </div>
    </div>
  );
}
