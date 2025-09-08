import { getArtist, ModerationEntityFilter } from '@/lib/moderation/queries';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Artist, Country, Industry } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { ModerationSendMessageForm } from '@/components/moderation/moderation-send-message-form';
import { formatLabel, formatValue } from '@/lib/props-format';

type ModerationArtist = Omit<
  Artist,
  | 'id'
  | 'active'
  | 'createdAt'
  | 'updatedAt'
  | 'userId'
  | 'moderationStatus'
  | 'moderationComment'
  | 'moderatorId'
  | 'adminMark'
>;

export default async function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const session = await auth();

  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  const t = await getTranslations('Page.ModerationArtistPage');
  const tIndustry = await getTranslations('Enum.Industry');
  const tCountry = await getTranslations('Enum.Country');
  const { artistId } = await params;
  const artist = await getArtist(artistId);

  return (
    <div>
      <h1 className="font-bold mb-6">{t('pageTitle')}</h1>
      <Card className="mb-[20px]">
        <CardContent className="space-y-4">
          {Object.keys(artist).map((prop) => (
            <div key={prop}>
              <h3 className="font-semibold">{formatLabel(prop)}</h3>
              {prop === 'industry' ? (
                <p>
                  {(artist[prop as keyof ModerationArtist] as Industry[])
                    .map((industry) => tIndustry(industry))
                    .join(',')}
                </p>
              ) : prop === 'bio' ? (
                <p className="whitespace-pre-wrap truncate">
                  {formatValue(artist[prop as keyof ModerationArtist]) || '-'}
                </p>
              ) : prop === 'countryCitizenship' || prop === 'countryResidence' ? (
                <p>{tCountry(formatValue(artist[prop as keyof ModerationArtist]) as Country)}</p>
              ) : (
                <p>{formatValue(artist[prop as keyof ModerationArtist]) || '-'}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      <ModerationSendMessageForm entity={ModerationEntityFilter.artist} id={artistId} />
    </div>
  );
}
