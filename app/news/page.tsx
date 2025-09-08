import { SearchPagination } from '@/components/common/search-pagination';

import { getPublicNews } from '@/lib/news/queries';
import { getTranslations } from 'next-intl/server';
import NewsList from '../../components/news/news-list';
import { getManagersGuides } from '@/lib/content/guide/queries';
import { GuideList } from './guide-list';

type NewsSearchParams = {
  page?: string;
};

export default async function PublicNewsPage({ searchParams }: { searchParams: Promise<NewsSearchParams> }) {
  const t = await getTranslations('Page.PublicNewsPage');

  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) - 1 : 0;

  const { news, pagesTotal } = await getPublicNews(page, false);
  const { guides } = await getManagersGuides();

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="font-bold">{t('title')}</h1>
      <p className="text-xl">{t('description')}</p>

      {guides.length > 0 && <GuideList guides={guides} />}

      {news.length === 0 && pagesTotal === 0 ? (
        <div className="text-center text-gray-600 py-6">
          <p>{t('noNews')}</p>
        </div>
      ) : (
        <>
          <NewsList news={news} backLink="news" />
          <SearchPagination currentPage={page + 1} pagesTotal={pagesTotal} />
        </>
      )}
    </div>
  );
}
