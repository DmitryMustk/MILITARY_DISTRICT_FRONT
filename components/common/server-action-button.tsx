'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ServerActionButtonProps<T extends unknown[]> extends Omit<ButtonProps, 'onClick'> {
  serverAction(...args: T): Promise<void>;

  actionArgs: T;

  refreshAfter?: boolean;
  toastAfter?: string;
}

export const ServerActionButton = <T extends unknown[]>({
  serverAction,
  actionArgs,
  refreshAfter,
  toastAfter,
  disabled,
  ...props
}: ServerActionButtonProps<T>) => {
  const router = useRouter();
  const { toast } = useToast();

  const [pending, startTransition] = useTransition();

  const handleClick = useCallback(
    () =>
      startTransition(async () => {
        await serverAction(...actionArgs);
        if (refreshAfter) {
          router.refresh();
        }
        if (toastAfter) {
          toast({ title: toastAfter });
        }
      }),
    // cannot be verified statically
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshAfter, router, serverAction, toast, toastAfter, ...actionArgs]
  );

  return <Button onClick={handleClick} disabled={disabled || pending} {...props} />;
};
