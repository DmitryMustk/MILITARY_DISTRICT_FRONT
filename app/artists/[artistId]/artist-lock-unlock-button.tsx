'use client';

import { ButtonWithConfirmation } from '@/components/ui/button-with-confirmation';
import { useToast } from '@/hooks/use-toast';
import { lockArtist, unlockArtist } from '@/lib/admin/action';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface ArtistLockUnlockButtonProps {
  artistId: number;
  locked: boolean;
}

export const ArtistLockUnlockButton = ({ artistId, locked }: ArtistLockUnlockButtonProps) => {
  const t = useTranslations('Component.ArtistLockUnlockButton');
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleLock = useCallback(() => {
    startTransition(async () => {
      await lockArtist(artistId);
      toast({ title: t('successfullyLock'), description: t('successfullyLockDesc') });
      router.refresh();
    });
  }, [artistId, toast, t, router]);

  const handleUnlock = useCallback(() => {
    startTransition(async () => {
      await unlockArtist(artistId);
      toast({ title: t('successfullyUnlock') });
      router.refresh();
    });
  }, [artistId, toast, t, router]);

  return (
    <>
      {locked ? (
        <ButtonWithConfirmation
          className="h-[50px] rounded-[50px] leading-[18px]"
          cancelLabel={t('unlockCancel')}
          confirmLabel={t('unlockConfirm')}
          label={t('unlockLabel')}
          onClick={handleUnlock}
          disabled={pending}
          closeOnClick
        />
      ) : (
        <ButtonWithConfirmation
          className="h-[50px] rounded-[50px] leading-[18px]"
          cancelLabel={t('lockCancel')}
          confirmLabel={t('lockConfirm')}
          label={t('lockLabel')}
          onClick={handleLock}
          disabled={pending}
          closeOnClick
          variant="destructive"
        />
      )}
    </>
  );
};
