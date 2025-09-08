import { getTranslations } from 'next-intl/server';
import { GuideForm } from '@/app/content/guides/guide-form';
import ResourceType = $Enums.ResourceType;
import { $Enums } from '@prisma/client';

export default async function CreateGuidePage() {
  const t = await getTranslations('Page.CreateGuidePage');

  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-3xl font-bold">{t('createGuide')}</h1>
      <GuideForm
        defaultValues={{
          title: '',
          file: { value: null },
          link: '',
          order: 0,
          resourceType: ResourceType.FILE,
        }}
      />
    </div>
  );
}
