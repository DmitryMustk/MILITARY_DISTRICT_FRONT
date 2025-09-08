import { getMyBlockedArtists } from '@/lib/opportunity/queries';
import { getTranslations } from 'next-intl/server';
import { BlockedArtistCard } from './blocked-artist-card';
import Link from 'next/link';

export default async function BannedArtistsPage() {
  const blockedArtists = await getMyBlockedArtists();
  const t = await getTranslations('Page.BannedArtistsPage');

  return (
    <div className="space-y-4">
      <h1 className="font-bold">{t('blockedArtists')}</h1>
      {blockedArtists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blockedArtists.map((artist) => (
            <BlockedArtistCard artist={artist} key={`blocked-artist-card-${artist.id}`} />
          ))}
        </div>
      ) : (
        <p>
          {t.rich('noBlockedArtists', {
            link: (chunks) => (
              <Link href="/provider/applications" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      )}
    </div>
  );
}
