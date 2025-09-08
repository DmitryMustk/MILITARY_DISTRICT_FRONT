import { SearchPagination } from '@/components/common/search-pagination';
import { Button } from '@/components/ui/button';
import { getManagersNews } from '@/lib/content/queries';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date-format';
import { NewsCard } from '@/components/news/news-card';

type NewsSearchParams = {
  page?: string;
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<NewsSearchParams> }) {
  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) - 1 : 0;

  const { pagesTotal, news } = await getManagersNews(page);

  const t = await getTranslations('Page.NewsPage');

  return (
    <div className="flex flex-col gap-8 items-center p-8">
      <h1>{t('news')}</h1>
      <Button className="w-32 self-end mx-16" asChild>
        <Link href={`/content/news/create`}>{t('createNews')}</Link>
      </Button>
      <div className="flex flex-wrap justify-center gap-8">
        {news.map((n) => (
          <div key={n.id} className="flex flex-col gap-4 justify-end">
            <NewsCard news={n}>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {n.showAtNewsPage && <Badge variant={'secondary'}>{t('published')}</Badge>}
                  {n.showAtHomePage && <Badge variant={'default'}>{t('atHome')}</Badge>}
                </div>
                <div>{formatDate(n.createdAt)}</div>
              </div>
            </NewsCard>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href={`/news/${n.id}?backLink=managers`}>{t('preview')} </Link>
              </Button>
              <Button asChild>
                <Link href={`/content/news/edit/${n.id}`}>{t('edit')}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <SearchPagination currentPage={page + 1} pagesTotal={pagesTotal} />
    </div>
  );
}
