import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { formatDate } from '@/lib/date-format';
import { getManagersStaticPages } from '@/lib/content/static-page/queries';
import { StaticPageCard } from '@/app/content/static-page/static-page-card';

export default async function StaticPagesPage() {
  const { pages } = await getManagersStaticPages();

  const t = await getTranslations('Page.StaticPagesPage');

  return (
    <div className="flex flex-col gap-8 items-center p-8">
      <h1>{t('pageTitle')}</h1>
      <Button className="w-40 self-end mx-16" asChild>
        <Link href={`/content/static-page/create`}>{t('createButton')}</Link>
      </Button>
      {pages.length === 0 ? (
        <p>{t('noPages')}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {pages.map((page) => (
            <div key={page.id} className="flex flex-col gap-4 justify-end">
              <StaticPageCard page={page}>
                <div className="flex items-center justify-between">
                  <div>{formatDate(page.createdAt)}</div>
                </div>
              </StaticPageCard>
              <div className="flex gap-2 justify-center">
                <Button asChild variant="secondary">
                  <Link href={`/page/${page.slug}?backLink=content-pages`}>{t('preview')}</Link>
                </Button>
                <Button asChild>
                  <Link href={`/content/static-page/edit/${page.id}`}>{t('editButton')}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
