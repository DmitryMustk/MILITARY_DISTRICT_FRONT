'use client';

import { Button } from '@/components/ui/button';
import React, { useCallback, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { resendInvitation } from '@/lib/admin/provider-invitation';
import { useTranslations } from 'next-intl';

interface ProviderInvitationResendButtonProps {
  invitationId: string;
}

export default function ProviderInvitationResendButton({ invitationId }: ProviderInvitationResendButtonProps) {
  const t = useTranslations('Component.ProviderInvitationResendButton');

  const { toast } = useToast();

  const [pending, startTransition] = useTransition();

  const handleClick = useCallback(
    () =>
      startTransition(async () => {
        await resendInvitation(invitationId);
        startTransition(() => {
          toast({
            title: t(`successToastTitle`),
          });
        });
      }),
    [invitationId, toast, t]
  );

  return (
    <Button disabled={pending} onClick={handleClick}>
      {t(`buttonText`)}
    </Button>
  );
}
