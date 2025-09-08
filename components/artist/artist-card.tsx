import { Country, Industry, Languages } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';
import { artistName } from '@/lib/artist/utils';
import { MoreHorizontal } from 'lucide-react';
import { CollapsibleWithIcon } from '../common/collapsible-with-icon';
import ExpandableText from '../common/expandable-text';

const MAX_LINKS_COUNT = 10;

type Artist = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  statement?: string | null;
  languages: Languages[];
  phone?: string | null;
  countryResidence: Country;
  links: string[];
  artistName?: string | null;
  industry?: Industry[];
  adminMark?: string;
  user?: {
    email: string | null;
  };
};

interface ArtistCardProps extends PropsWithChildren {
  artist: Artist;
  limitSize?: boolean;
}

export const ArtistCard = ({ artist, children, limitSize }: ArtistCardProps) => {
  const t = useTranslations('Component.ArtistCard');
  const tIndustry = useTranslations('Enum.Industry');
  const tCountry = useTranslations('Enum.Country');

  return (
    <Card className="border-none flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{artistName(artist, t('unknownName'))}</CardTitle>
          <CardDescription>{t('artist')}</CardDescription>
          {artist?.adminMark && (
            <div>
              <Badge variant="secondary">{artist.adminMark}</Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!!artist.bio && (
            <div>
              <h6 className="font-semibold font-archivo">{t('bio')}</h6>
              {limitSize ? (
                <p className="mt-2 mb-2 line-clamp-3 whitespace-pre-wrap truncate">{artist.bio}</p>
              ) : (
                <ExpandableText text={artist.bio} />
              )}
            </div>
          )}
          {!!artist.statement && (
            <div>
              <h6 className="font-semibold font-archivo">{t('statement')}</h6>
              <p className={limitSize ? 'line-clamp-3' : ''}>{artist.statement}</p>
            </div>
          )}
          {!!artist.industry?.length && (
            <div>
              <h6 className="font-semibold font-archivo">{t('industry')}</h6>
              <li className="flex gap-1 flex-wrap">
                {artist.industry.map((ind, idx) => (
                  <Badge variant={'secondary'} key={idx}>
                    {tIndustry(ind)}
                  </Badge>
                ))}
              </li>
            </div>
          )}
          {artist.languages?.length !== 0 && (
            <div>
              <h6 className="font-semibold font-archivo">{t('languages')}</h6>
              <p className={limitSize ? 'line-clamp-3' : ''}>{artist.languages.join(', ')}</p>
            </div>
          )}
          {!!artist?.user?.email && (
            <div>
              <h6 className="font-semibold font-archivo">{t('email')}</h6>
              <p>
                <a className="text-gray-50 hover:text-blue" href={`mailto:${artist.user.email}`}>
                  {artist.user.email}
                </a>
              </p>
            </div>
          )}
          {!!artist.phone && (
            <div>
              <h6 className="font-semibold font-archivo">{t('phone')}</h6>
              <p>{artist.phone}</p>
            </div>
          )}
          {!!artist.countryResidence && (
            <div>
              <h6 className="font-semibold font-archivo">{t('countryResidence')}</h6>
              <p>{tCountry(artist.countryResidence)}</p>
            </div>
          )}
          {artist.links?.length > 0 && (
            <div>
              <h6 className="font-semibold font-archivo">{t('links')}</h6>
              {limitSize ? (
                <li className="flex flex-col">
                  {artist.links.map((link, idx) => (
                    <a key={idx} className="text-gray-50 hover:text-blue [&:nth-child(n+5)]:hidden" href={link}>
                      {link}
                    </a>
                  ))}
                  <MoreHorizontal className="hidden [&:nth-child(n+6)]:inline" />
                </li>
              ) : artist.links.length <= MAX_LINKS_COUNT ? (
                artist.links.map((link, idx) => (
                  <a key={idx} className="text-gray-50 hover:text-blue" href={link}>
                    {link}
                  </a>
                ))
              ) : (
                <CollapsibleWithIcon>
                  {artist.links.map((link, idx) => (
                    <a key={idx} className="text-gray-50 hover:text-blue" href={link}>
                      {link}
                    </a>
                  ))}
                </CollapsibleWithIcon>
              )}
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex gap-2 flex-wrap">{children}</CardFooter>
    </Card>
  );
};
