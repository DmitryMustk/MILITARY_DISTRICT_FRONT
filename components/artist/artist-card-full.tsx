import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { artistName } from '@/lib/artist/utils';
import { Artist, ModerationStatus, Role, User } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { ArtistAdminMarkSelect } from '@/app/artists/[artistId]/artist-admin-mark-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArtistLockUnlockButton } from '@/app/artists/[artistId]/artist-lock-unlock-button';
import { useTranslations } from 'next-intl';
import { differenceInDays, differenceInMinutes, format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import ExpandableText from '@/components/common/expandable-text';
import { CollapsibleWithIcon } from '@/components/common/collapsible-with-icon';
import { getLastMonthDate, getLastWeekDate, getLastYearDate } from '@/lib/date-format';
import { ArtistSendToModerationButton } from '@/components/artist/artist-send-to-moderation-button';
import { ReactNode } from 'react';
import { BackButton } from '@/components/common/back-button';

const LINKS_LENGTH_WITHOUT_COLLAPSIBLE = 10;

type ArtistCardFullProps = {
  artist: Partial<Artist> & { user?: Partial<User> };
  artistId: string;
  lastOpenApplication?: Date | null;
  artistProfileComplete: number;
  projectCount: number;
  activeApplicationCount: number;
  submittedApplications: { updatedAt: Date }[];
  needBackButton: boolean;
  className?: string;
};

const getModerationStatusText = (
  status: ModerationStatus,
  t: ReturnType<typeof useTranslations<'Component.ArtistCardFull'>>
) => {
  switch (status) {
    case ModerationStatus.OnModeration:
      return t('onModerationStatus');
    case ModerationStatus.Approved:
      return t('approvedStatus');
    case ModerationStatus.Denied:
      return t('deniedStatus');
    default:
      return t('draftStatus');
  }
};

const getStatus = (
  t: ReturnType<typeof useTranslations<'Component.ArtistCardFull'>>,
  moderationStatus?: ModerationStatus,
  locked?: boolean,
  lastOpenApplication?: Date | null
) => {
  if (moderationStatus === undefined || locked === undefined) {
    return undefined;
  }
  if (locked) {
    return t('lockedByAdmin');
  }
  if (
    moderationStatus !== ModerationStatus.Denied &&
    lastOpenApplication &&
    differenceInMinutes(new Date(), lastOpenApplication) >
      parseInt(process.env.ARTIST_OPEN_APPLICATION_DURATION_UNTIL_SHOW_ERROR_IN_MINUTES!)
  ) {
    return t('artistHasOldApplication');
  }
  return getModerationStatusText(moderationStatus, t);
};

const Title = ({ children }: { children: ReactNode }) => {
  return <h3 className="font-semibold !text-xl">{children}</h3>;
};

const Row = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-between items-center">{children}</div>;
};

export const ArtistCardFull = async ({
  artist,
  artistId,
  lastOpenApplication,
  artistProfileComplete,
  projectCount,
  activeApplicationCount,
  submittedApplications,
  needBackButton,
  className,
}: ArtistCardFullProps) => {
  const t = await getTranslations('Component.ArtistCardFull');
  const tIndustry = await getTranslations('Enum.Industry');
  const session = await auth();
  const isCurrentArtist = String(session?.user?.artistId) === artistId;
  const isAdmin = session?.user?.role.includes(Role.ADMINISTRATOR);

  const status = getStatus(t, artist.moderationStatus, artist.user?.locked, lastOpenApplication);

  const lastWeekDate = getLastWeekDate();
  const submittedApplicationLastWeek = submittedApplications.filter((record) => record.updatedAt >= lastWeekDate);

  const lastMonthDate = getLastMonthDate();
  const submittedApplicationLastMonth = submittedApplications.filter((record) => record.updatedAt >= lastMonthDate);

  const lastYearDate = getLastYearDate();
  const submittedApplicationLastYear = submittedApplications.filter((record) => record.updatedAt >= lastYearDate);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-semibold">{artistName(artist, t('unknownName'))}</CardTitle>
        <CardDescription className="leading-4 !mt-2.5">{t('artistProfile')}</CardDescription>
        {isAdmin && artist.id && artist.adminMark && (
          <div className="w-min !mt-2.5">
            <ArtistAdminMarkSelect artistId={artist.id} initialValue={artist.adminMark} />
          </div>
        )}
        {!isCurrentArtist && !!status && (
          <div className="!mt-2.5">
            <Badge>{status}</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isCurrentArtist && artist.moderationStatus && (
          <div>
            <Title>{t('moderationStatusTitle')}</Title>
            <p>{getModerationStatusText(artist.moderationStatus, t)}</p>
          </div>
        )}
        {isCurrentArtist && artist.moderationStatus === ModerationStatus.Denied && (
          <div>
            <Title>{t('moderationStatusReason')}</Title>
            <p>{artist.moderationComment}</p>
          </div>
        )}
        <div>
          <Title>{t('profileComplete')}</Title>
          <div className="space-y-1">
            <Badge variant="secondary">{`${artistProfileComplete}%`}</Badge>
            <Slider value={[artistProfileComplete]} max={100} disabled className="max-w-[100px]" />
          </div>
        </div>
        {!!artist.user?.email && (
          <div>
            <Title>{t('email')}</Title>
            <p>
              {isCurrentArtist ? (
                artist.user.email
              ) : (
                <a className="text-gray-50 hover:text-blue" href={`mailto:${artist.user.email}`}>
                  {artist.user.email}
                </a>
              )}
            </p>
          </div>
        )}
        {!!artist.bio && (
          <div>
            <Title>{t('bio')}</Title>
            <ExpandableText text={artist.bio} />
          </div>
        )}
        {isCurrentArtist && !!artist.phone && (
          <div>
            <Title>{t('phone')}</Title>
            <p>{artist.phone}</p>
          </div>
        )}
        {!!artist.languages?.length && artist.languages.length > 0 && (
          <div>
            <Title>{t('languages')}</Title>
            <ExpandableText text={artist.languages.join(', ')} />
          </div>
        )}
        {!!artist.industry?.length && artist.industry.length > 0 && (
          <div>
            <Title>{t('industry')}</Title>
            <div className="flex gap-1 flex-wrap">
              {artist.industry.map((ind, idx) => (
                <Badge variant={'secondary'} key={idx}>
                  {tIndustry(ind)}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {!!artist.links && artist.links.length > 0 && (
          <div>
            <Title>{t('links')}</Title>
            {artist.links.length > LINKS_LENGTH_WITHOUT_COLLAPSIBLE ? (
              <CollapsibleWithIcon>
                <div className="flex flex-col">
                  {artist.links.map((link, idx) => (
                    <a key={idx} className="text-gray-50 hover:text-blue" href={link}>
                      {link}
                    </a>
                  ))}
                </div>
              </CollapsibleWithIcon>
            ) : (
              <div className="flex flex-col">
                {artist.links.map((link, idx) => (
                  <a key={idx} className="text-gray-50 hover:text-blue" href={link}>
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        {!!artist.createdAt && (
          <div>
            <Title>{t('dateOfRegistration')}</Title>
            <p>{format(artist.createdAt, 'PPP')}</p>
          </div>
        )}
        <Row>
          <Title>{t('postedProject')}</Title>
          <p>{projectCount}</p>
        </Row>
        <Row>
          <Title>{t('activeApplications')}</Title>
          <p>{activeApplicationCount}</p>
        </Row>
        <Row>
          <Title>{t('submittedApplicationsLastWeek')}</Title>
          <p>{submittedApplicationLastWeek.length}</p>
        </Row>
        <Row>
          <Title>{t('submittedApplicationsLastMonth')}</Title>
          <p>{submittedApplicationLastMonth.length}</p>
        </Row>
        <Row>
          <Title>{t('submittedApplicationsLastYear')}</Title>
          <p>{submittedApplicationLastYear.length}</p>
        </Row>
        {!!lastOpenApplication && (
          <Row>
            <Title>{t('lastOpenApplication')}</Title>
            <p>{differenceInDays(new Date(), lastOpenApplication)}</p>
          </Row>
        )}
        {!session && (
          <Button className="w-full text-neutral-gray" variant="link">
            <Link href="/auth/signin" className="whitespace-pre-wrap">
              {t('registerAsProvider')}
            </Link>
          </Button>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full pt-4 flex justify-end items-center gap-3 flex-wrap">
          {needBackButton && (
            <BackButton size="lg" variant="outline">
              {t('backArtists')}
            </BackButton>
          )}
          <Button size="lg" asChild variant="outline">
            <Link href={isCurrentArtist ? `/artist/projects` : `/artists/${artistId}/projects`}>{t('goProjects')}</Link>
          </Button>
          {session?.user?.role.includes(Role.ADMINISTRATOR) && artist.id && (
            <ArtistLockUnlockButton locked={!!artist.user?.locked} artistId={artist.id} />
          )}
          {isCurrentArtist && artist.moderationStatus && (
            <ArtistSendToModerationButton moderationStatus={artist.moderationStatus} />
          )}
          {isCurrentArtist && (
            <Button size="lg" asChild>
              <Link href="/artist/profile/edit">{t('updateProfile')}</Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
