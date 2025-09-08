import { Artist } from '@prisma/client';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { artistName } from '@/lib/artist/utils';

export const ModerationArtistCard = async ({ artist }: { artist: Artist }) => {
  const t = await getTranslations('Component.ModerationArtistCard');

  return (
    <Link href={`/moderation/artist/${artist.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{artistName(artist, t('unknownName'))}</CardTitle>
          <CardDescription>{t('artist')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!!artist.bio && (
            <div>
              <h3 className="font-semibold">{t('bio')}</h3>
              <p className="line-clamp-3 whitespace-pre-wrap truncate">{artist.bio}</p>
            </div>
          )}
          {!!artist.updatedAt && (
            <div>
              <h3 className="font-semibold">{t('updated')}</h3>
              <p className="line-clamp-3">{artist.updatedAt.toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
