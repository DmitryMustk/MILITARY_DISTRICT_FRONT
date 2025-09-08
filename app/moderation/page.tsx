import { getTranslations } from 'next-intl/server';
import { ModerationSearchForm } from '@/app/moderation/moderation-search-form';
import { SearchPagination, SearchPaginationSearchParams } from '@/components/common/search-pagination';
import {
  getFilteredModerationRequests,
  ModerationDateFilter,
  ModerationEntityFilter,
  PER_PAGE_LIMIT,
} from '@/lib/moderation/queries';
import React from 'react';
import { auth } from '@/lib/auth';
import { forbidden } from 'next/navigation';
import { ModerationArtistCard } from '@/components/moderation/moderation-artist-card';
import { ModerationProjectCard } from '@/components/moderation/moderation-project-card';

type SearchParams = SearchPaginationSearchParams & {
  entity: ModerationEntityFilter;
  date: ModerationDateFilter;
};

export default async function ModerationPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();

  if (!session?.user?.role.includes('MODERATOR')) {
    forbidden();
  }

  const t = await getTranslations('Page.ModerationPage');
  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) : 1;
  const filter = {
    entityFilter: params.entity,
    dateFilter: params.date,
  };

  const { pagesTotal, artists, projects } = await getFilteredModerationRequests(filter, page);

  return (
    <div>
      <h1 className="font-bold mb-6">{t('pageTitle')}</h1>
      <div className="flex pb-4">
        <ModerationSearchForm />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
        {artists.map((artist) => (
          <ModerationArtistCard key={artist.id} artist={artist} />
        ))}
        {projects.map((project) => (
          <ModerationProjectCard key={project.id} project={project} />
        ))}
      </div>
      <SearchPagination currentPage={page} pagesTotal={Math.ceil(pagesTotal / PER_PAGE_LIMIT)} />
    </div>
  );
}
