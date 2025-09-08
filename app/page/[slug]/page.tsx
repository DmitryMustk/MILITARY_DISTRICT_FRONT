import { formatDate } from '@/lib/date-format';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { getTranslations } from 'next-intl/server';
import { getStaticPageBySlug } from '@/lib/content/static-page/queries';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PublicStaticPageDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ backLink: 'content/pages' }>;
}) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);
  const t = await getTranslations('Page.PublicStaticPageDetailsPage');

  const { backLink } = await searchParams;

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {backLink && (
        <Link className="ml-auto text-muted-foreground mb-6 flex gap-2" href={'/content/static-page'}>
          <ArrowLeft /> {t('backLink')}
        </Link>
      )}
      <h1 className="font-bold mb-4 text-center">{page.title || page.slug}</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">{formatDate(page.createdAt)}</p>
      {page.html ? (
        <div className="bn-container w-full">
          <div className="bn-default-styles" dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      ) : (
        <p>{t('noContent')}</p>
      )}
    </div>
  );
}
