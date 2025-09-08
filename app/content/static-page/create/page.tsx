import { getTranslations } from 'next-intl/server';
import { StaticPageForm } from '@/app/content/static-page/static-page-form';

export default async function CreateStaticPagePage() {
  const t = await getTranslations('Page.CreateStaticPagePage');

  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-3xl font-bold">{t('pageTitle')}</h1>
      <StaticPageForm
        defaultValues={{
          slug: '',
          title: '',
          order: 0,
        }}
      />
    </div>
  );
}
