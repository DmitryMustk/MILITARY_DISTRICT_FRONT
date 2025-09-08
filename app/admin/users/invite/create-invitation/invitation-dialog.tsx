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
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import UserInvitationForm from './invitation-form';

export default function UserInvitationDialog() {
  const t = useTranslations('Component.UserInvitationDialog');

  const [open, setOpen] = useState(false);

  const closeDialog = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="text-sm">
        <Button>{t(`triggerButton`)}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t(`title`)}</DialogTitle>
          <DialogDescription>{t(`description`)}</DialogDescription>
        </DialogHeader>
        <UserInvitationForm onSubmitAction={closeDialog}>
          <DialogClose asChild>
            <Button variant="outline">{t(`closeButton`)}</Button>
          </DialogClose>
        </UserInvitationForm>
      </DialogContent>
    </Dialog>
  );
}
