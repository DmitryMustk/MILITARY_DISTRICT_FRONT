import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('Page.NotFound');
  return (
    <div className="flex flex-col items-center space-y-4 mt-16">
      <h2 className="text-lg">{t('notFound')}</h2>
      <p>{t('failedLoadResource')}</p>
      <Button asChild>
        <Link href="/">{t('returnHome')}</Link>
      </Button>
    </div>
  );
}
