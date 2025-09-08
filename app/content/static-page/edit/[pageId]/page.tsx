import { getTranslations } from 'next-intl/server';
import { getManagersStaticPageById } from '@/lib/content/static-page/queries';
import { StaticPageForm } from '@/app/content/static-page/static-page-form';

export default async function EditStaticPage({ params }: { params: Promise<{ pageId: string }> }) {
  const t = await getTranslations('Page.EditStaticPagePage');

  const { pageId } = await params;
  const id = parseInt(pageId);
  const page = await getManagersStaticPageById(id);

  return (
    <div className="space-y-8">
      <h1 className="font-bold">{t('pageTitle')}</h1>
      <StaticPageForm
        defaultValues={{
          slug: page.slug,
          title: page.title || '',
          order: page.order || 0,
        }}
        existingPage={{
          blocks: page.blocks ? JSON.parse(page.blocks) : undefined,
          id: page.id,
          uuid: page.uuid,
          slug: page.slug,
          title: page.title || '',
          order: page.order || 0,
        }}
      />
    </div>
  );
}
