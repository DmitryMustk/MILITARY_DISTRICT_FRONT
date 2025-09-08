'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { resetEmail } from '@/lib/user/credentials-reset';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function VerifyButton({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations('Page.EmailVerificationPage');

  const handleClick = () => {
    startTransition(async () => {
      const res = await resetEmail(requestId);
      if (res.success) {
        toast({
          title: t('successTitle'),
          description: t('successDesc'),
        });
        router.push('/user/account-settings');
      } else {
        toast({
          title: t('errorTitle'),
          description: res.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Button className="mt-4" onClick={handleClick} disabled={pending}>
      {pending ? t('pendingText') : t('buttonText')}
    </Button>
  );
}
