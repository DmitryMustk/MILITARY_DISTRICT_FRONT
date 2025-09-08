import { ArtistsQuerySearchParams, getArtists } from '@/lib/artist/queries';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { SearchPagination } from '@/components/common/search-pagination';
import { decodeURIArrayParam } from '@/lib/utils';
import { ArtistCard } from '@/components/artist/artist-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProjectCard from '@/components/project/project-card';
import { ArtistsSearchForm } from './artists-search-form';

export type ArtistSearchParams = {
  page?: string;
  artist?: string;
  project?: string;
  language?: string;
  theme?: string;
  industry?: string;
  'age-to'?: string;
  'age-from'?: string;
  'country-residence'?: string;
  'country-citizenship'?: string;
  'reach-to'?: string;
  'reach-from'?: string;
  budget?: string;
  'include-project'?: string;
};

export default async function ArtistsPage({ searchParams }: { searchParams: Promise<ArtistSearchParams> }) {
  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) : 1;
  const searchRequest = {
    ...params,
    language: decodeURIArrayParam(params.language),
    theme: decodeURIArrayParam(params.theme),
    'country-citizenship': decodeURIArrayParam(params['country-citizenship']),
    'country-residence': decodeURIArrayParam(params['country-residence']),
    industry: decodeURIArrayParam(params.industry),
    budget: params.budget
      ? isNaN(parseInt(params.budget))
        ? params.budget === 'true'
        : parseInt(params.budget)
      : undefined,
  } as ArtistsQuerySearchParams;
  const data = await getArtists(searchRequest, page);

  const session = await auth();
  const t = await getTranslations('Page.ArtistsPage');

  const hasFilters = Object.keys(params as ArtistSearchParams).some(
    (key) =>
      key !== 'page' &&
      key !== 'include-project' &&
      params[key as keyof ArtistSearchParams] !== undefined &&
      params[key as keyof ArtistSearchParams] !== ''
  );

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h1 className="font-bold">{t('artists')}</h1>
        <ArtistsSearchForm />
        {data.filteredData.length === 0 ? (
          <div className="text-center text-gray-600 py-6">
            {data.pagesTotal === 0 && !hasFilters ? (
              <p>{params['include-project'] ? t('noProjects') : t('noArtists')}</p>
            ) : (
              <p>{params['include-project'] ? t('noProjectsFiltered') : t('noArtistsFiltered')}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!params['include-project'] &&
              data.filteredData.map((artist, idx) => (
                <ArtistCard artist={artist} key={idx} limitSize>
                  <Button asChild>
                    {artist.id === session?.user?.artistId ? (
                      <Link href={`/artist/profile?fromArtists=true`}>{t('viewYourProfile')}</Link>
                    ) : (
                      <Link href={`/artists/${artist.id}`}>{t('viewProfile')}</Link>
                    )}
                  </Button>
                  {!!session?.user?.providerId && (
                    <Button variant="outline">
                      <Link href={`/provider/opportunity-invites/artist/${artist.id}`}>{t('invite')}</Link>
                    </Button>
                  )}
                </ArtistCard>
              ))}
            {!!params['include-project'] &&
              data.filteredData.map((data, idx) => (
                <ProjectCard project={data} key={idx} limitSize>
                  <Button asChild>
                    {data.id === session?.user?.artistId ? (
                      <Link href={`/artist/profile?fromArtists=true`}>{t('viewYourProfile')}</Link>
                    ) : (
                      <Link href={`/artists/${data.id}`}>{t('viewProfile')}</Link>
                    )}
                  </Button>
                </ProjectCard>
              ))}
          </div>
        )}
      </div>
      {data.filteredData.length > 0 && <SearchPagination currentPage={page} pagesTotal={data.pagesTotal} />}
    </div>
  );
}
