import { getManagersGuides } from '@/lib/content/guide/queries';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GuideCard } from '@/app/content/guides/guide-card';

export default async function GuidesPage() {
  const { guides } = await getManagersGuides();
  const t = await getTranslations('Page.GuidesPage');

  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-3xl font-bold">{t('pageTitle')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6">
        {guides.map((guide) => (
          <GuideCard guide={guide} key={guide.id} />
        ))}
      </div>
      <Button asChild>
        <Link href={`/content/guides/create`}>{t('createButton')}</Link>
      </Button>
    </div>
  );
}
