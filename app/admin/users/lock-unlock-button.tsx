'use client';

import { Button } from '@/components/ui/button';
import React, { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { setUserLocked } from '@/lib/admin/user-managements';

interface LockUnlockButtonProps {
  userId: number;
  isLocked: boolean;
}

export default function LockUnlockButton({ userId, isLocked }: LockUnlockButtonProps) {
  const t = useTranslations('Component.UserLockUnlockButton');

  const router = useRouter();

  const [pending, startTransition] = useTransition();

  const handleClick = useCallback(() => {
    startTransition(async () => {
      await setUserLocked(userId, !isLocked);
      router.refresh();
    });
  }, [isLocked, userId, router]);

  return (
    <Button variant={isLocked ? `outline` : `destructive`} disabled={pending} onClick={handleClick}>
      {t(isLocked ? `unlock` : `lock`)}
    </Button>
  );
}
