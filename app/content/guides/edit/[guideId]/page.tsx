import { getTranslations } from 'next-intl/server';
import { GuideForm } from '@/app/content/guides/guide-form';
import { getManagersGuideById } from '@/lib/content/guide/queries';

export default async function EditGuidePage({ params }: { params: Promise<{ guideId: string }> }) {
  const t = await getTranslations('Page.EditGuidePage');

  const { guideId } = await params;
  const id = parseInt(guideId);
  const guide = await getManagersGuideById(id);

  const resource = typeof guide.resource === 'string' ? JSON.parse(guide.resource) : guide.resource || {};

  const defaultValues = {
    title: guide.title,
    resourceType: guide.resourceType,
    file: resource.file || { value: null },
    link: resource.url || '',
    order: guide.order || 0,
  };

  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-3xl font-bold">{t('editGuide')}</h1>
      <GuideForm guideId={id} defaultValues={defaultValues} />
    </div>
  );
}
