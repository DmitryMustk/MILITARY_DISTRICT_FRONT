'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useCallback, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ModerationEntityFilter } from '@/lib/moderation/queries';
import { updateArtistModerationStatus, updateProjectModerationStatus } from '@/lib/moderation/action';
import { ModerationStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const ModerationSendMessageForm = ({ entity, id }: { entity: ModerationEntityFilter; id: string }) => {
  const t = useTranslations('Component.ModerationSendMessageForm');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value), []);

  const onApprove = useCallback(async () => {
    startTransition(async () => {
      if (entity === ModerationEntityFilter.artist) {
        await updateArtistModerationStatus(id, ModerationStatus.Approved, message);
      } else if (entity === ModerationEntityFilter.project) {
        await updateProjectModerationStatus(id, ModerationStatus.Approved, message);
      }
      router.back();
    });
  }, [entity, id, message, router]);

  const onDeny = useCallback(async () => {
    startTransition(async () => {
      if (entity === ModerationEntityFilter.artist) {
        await updateArtistModerationStatus(id, ModerationStatus.Denied, message);
      } else if (entity === ModerationEntityFilter.project) {
        await updateProjectModerationStatus(id, ModerationStatus.Denied, message);
      }
      router.back();
    });
  }, [entity, id, message, router]);

  return (
    <div className="space-y-2">
      <Label htmlFor="message">{t('messageFieldLabel')}</Label>
      <p className="text-sm font-medium text-red-500">{t('messageFieldSubtitle')}</p>
      <Textarea name="message" disabled={isPending} value={message} onChange={onMessageChange} rows={6} />
      <div className="flex justify-end gap-[10px]">
        <Button disabled={isPending} variant="outline" onClick={onApprove}>
          {t('approveButton')}
        </Button>
        <Button disabled={!message || isPending} variant="destructive" onClick={onDeny}>
          {t('denyButton')}
        </Button>
        <Button disabled={isPending} variant="outline" onClick={() => router.back()}>
          {t('backLink')}
        </Button>
      </div>
    </div>
  );
};
