import { formatDate } from '@/lib/date-format';
import { getPublicNewsById } from '@/lib/news/queries';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { getTranslations } from 'next-intl/server';

export default async function PublicNewsDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ newsId: string }>;
  searchParams: Promise<{ backLink: 'home' | 'news' | 'managers' }>;
}) {
  const { newsId } = await params;
  const id = parseInt(newsId);
  const news = await getPublicNewsById(id);
  const t = await getTranslations('Page.PublicNewsDetailsPage');

  const { backLink } = await searchParams;

  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-[1400px] sm:px-8 lg:px-16 xl:px-32">
      {backLink && (
        <Link
          className="mr-auto text-muted-foreground flex gap-2"
          href={backLink === 'home' ? '/' : backLink === 'news' ? '/news' : '/content/news'}
        >
          <ArrowLeft /> {t(backLink)}
        </Link>
      )}
      <h1 className="font-bold text-center">{news.title}</h1>
      <p className="text-xl text-center max-w-2xl">{formatDate(news.createdAt)}</p>
      {news.html && (
        <div className="bn-container w-full">
          <div className=" bn-default-styles text-justify" dangerouslySetInnerHTML={{ __html: news.html }} />
        </div>
      )}
    </div>
  );
}
