import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type ErrorParams = {
  error?: string;
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<ErrorParams> }) {
  const t = await getTranslations('Page.AuthErrorPage');
  const params = await searchParams;

  return (
    <div className="flex flex-col justify-center items-center space-y-4 min-h-[calc(100vh-200px)]">
      <h2>{params.error ?? t('errorOccurred')}</h2>
      <p>{t('tryAgainOrContactSupport')}</p>
      <div className="space-x-4">
        <Button variant="outline">
          <Link className="text-sm" href="/auth/signin">
            {t('returnSignIn')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
