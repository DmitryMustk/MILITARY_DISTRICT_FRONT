import { getTranslations } from 'next-intl/server';
import NewsForm from '../../news-form';
import { getManagersNewsById } from '@/lib/content/queries';

export default async function EditNewsPage({ params }: { params: Promise<{ newsId: string }> }) {
  const t = await getTranslations('Page.CreateNewsPage');

  const { newsId } = await params;
  const id = parseInt(newsId);
  const news = await getManagersNewsById(id);

  return (
    <div className="flex flex-col gap-8 py-8 md:px-32">
      <h1 className="font-bold">{t('createNews')}</h1>
      <NewsForm
        defaultValues={{
          ...news,
          description: news.description || undefined,
          mainPictureId: news.mainPictureId || undefined,
        }}
        existingNews={{ content: news.blocks ? JSON.parse(news.blocks) : undefined, newsId: news.id, uuid: news.uuid }}
      />
    </div>
  );
}
