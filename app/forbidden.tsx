import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Forbidden() {
  const t = await getTranslations('Page.Forbidden');
  return (
    <div className="flex flex-col items-center space-y-4 mt-16">
      <h2 className="text-lg">{t('forbidden')}</h2>
      <p>{t('youNotAuthorized')}</p>
      <Button asChild>
        <Link href="/">{t('returnHome')}</Link>
      </Button>
    </div>
  );
}
