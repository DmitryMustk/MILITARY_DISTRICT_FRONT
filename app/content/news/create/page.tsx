import { getTranslations } from 'next-intl/server';
import NewsForm from '../news-form';

export default async function CreateNewsPage() {
  const t = await getTranslations('Page.CreateNewsPage');

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1>{t('createNews')}</h1>
      <NewsForm
        defaultValues={{
          createdAt: new Date(),
          showAtHomePage: false,
          showAtNewsPage: false,
          title: '',
          description: '',
        }}
      />
    </div>
  );
}
