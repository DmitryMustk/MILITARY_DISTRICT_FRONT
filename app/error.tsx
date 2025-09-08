'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const t = useTranslations('Page.Error');

  return (
    <div className="flex flex-col items-center space-y-4 mt-16">
      <h2 className="text-lg">{error.message ?? t('errorOccurred')}</h2>
      <p>{t('tryAgainOrContactSupport')}</p>
      <div className="space-x-4">
        <Button onClick={reset}>{t('tryAgain')}</Button>
        <Link className="text-sm" href="/">
          {t('returnHome')}
        </Link>
      </div>
    </div>
  );
}
