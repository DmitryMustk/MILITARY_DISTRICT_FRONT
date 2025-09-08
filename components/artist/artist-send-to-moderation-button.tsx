'use client';

import { Button } from '@/components/ui/button';
import { useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateModerationStatus } from '@/lib/artist/action';
import { $Enums } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const ArtistSendToModerationButton = ({ moderationStatus }: { moderationStatus: $Enums.ModerationStatus }) => {
  const t = useTranslations('Component.ArtistSendToModerationButton');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSendToModeration = useCallback(async () => {
    startTransition(async () => {
      await updateModerationStatus($Enums.ModerationStatus.OnModeration);
      router.refresh();
    });
  }, [router]);

  if (moderationStatus !== $Enums.ModerationStatus.Draft) {
    return null;
  }

  return (
    <Button size="lg" disabled={isPending} variant="outline" onClick={onSendToModeration}>
      {t('sendToModerationButton')}
    </Button>
  );
};
