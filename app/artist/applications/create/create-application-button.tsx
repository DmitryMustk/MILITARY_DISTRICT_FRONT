'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function CreateApplicationButton({ opportunityId }: { opportunityId: number }) {
  const t = useTranslations('Component.CreateApplicationButton');
  const router = useRouter();

  const handleApply = () => {
    const currentUrl = window.location.href;
    const encodedReferer = encodeURIComponent(currentUrl);
    router.push(`/artist/applications/create/${opportunityId}?referer=${encodedReferer}`);
  };

  return <Button onClick={handleApply}>{t('title')}</Button>;
}
