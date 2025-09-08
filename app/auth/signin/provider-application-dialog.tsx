'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProviderApplicationForm } from './provider-application-form';
import { useTranslations } from 'next-intl';

export const ProviderApplicationDialog = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Component.ProviderApplicationDialog');

  const handleSend = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-neutral-gray h-6">
          {t('becomeProvider')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[760px] h-full overflow-y-auto max-w-md">
        <DialogHeader>
          <DialogTitle>{t('sendApplication')}</DialogTitle>
          <DialogDescription>{t('providerDesc')}</DialogDescription>
        </DialogHeader>
        <ProviderApplicationForm onSuccessAction={handleSend}>
          <DialogClose asChild>
            <Button variant="outline">{t('close')}</Button>
          </DialogClose>
        </ProviderApplicationForm>
      </DialogContent>
    </Dialog>
  );
};
