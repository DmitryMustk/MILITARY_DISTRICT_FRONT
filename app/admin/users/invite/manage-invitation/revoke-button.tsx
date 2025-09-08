'use client';

import { Button } from '@/components/ui/button';
import React, { useCallback, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { revokeInvitation } from '@/lib/admin/provider-invitation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ProviderInvitationRevokeButtonProps {
  invitationId: string;
}

export default function ProviderInvitationRevokeButton({ invitationId }: ProviderInvitationRevokeButtonProps) {
  const t = useTranslations('Component.ProviderInvitationRevokeButton');

  const router = useRouter();
  const { toast } = useToast();

  const [pending, startTransition] = useTransition();

  const handleClick = useCallback(
    () =>
      startTransition(async () => {
        await revokeInvitation(invitationId);
        router.refresh();
        toast({
          title: t(`successToastTitle`),
        });
      }),
    [invitationId, router, toast, t]
  );

  return (
    <Button variant={`destructive`} disabled={pending} onClick={handleClick}>
      {t(`buttonText`)}
    </Button>
  );
}
