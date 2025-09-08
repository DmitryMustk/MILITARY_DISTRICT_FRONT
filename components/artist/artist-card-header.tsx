'use client';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPinHouse } from 'lucide-react';
import { Artist } from '@prisma/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import User from '@/public/images/user.svg';

interface ArtistCardHeaderProps {
  artist: Artist;
}

export function ArtistCardHeader({ artist }: ArtistCardHeaderProps) {
  const t = useTranslations('Component.ArtistCardHeader');
  const tCountry = useTranslations('Enum.Country');
  const name = useMemo(() => {
    if (artist.artistName) {
      return artist.artistName;
    }
    if (artist.firstName || artist.lastName) {
      return `${artist.firstName ?? ''} ${artist.lastName}`;
    }
    return t('unknown');
  }, [artist, t]);

  return (
    <CardHeader>
      <CardTitle className="flex gap-4 items-center">
        <Avatar>
          <AvatarFallback className="bg-primary-foreground text-primary border border-primary">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Link href={`/artists/${artist.id}`}>{name}</Link>
          <div className="flex gap-2 items-center text-sm text-muted-foreground">
            <MapPinHouse /> {tCountry(artist.countryResidence)}
          </div>
        </div>
      </CardTitle>
    </CardHeader>
  );
}
