'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface ButtonWithConfirmationProps extends ButtonProps {
  label: string;
  confirmLabel: string;
  cancelLabel: string;
  closeOnClick?: boolean;
  className?: string;
}

export const ButtonWithConfirmation = React.forwardRef<HTMLButtonElement, ButtonWithConfirmationProps>(
  ({ label, confirmLabel, className, cancelLabel, variant, onClick, closeOnClick, ...props }, ref) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
          onClick(e);
        }
        if (closeOnClick) {
          setShowConfirmation(false);
        }
      },
      [onClick, closeOnClick]
    );

    if (!showConfirmation) {
      return (
        <Button
          type="button"
          ref={ref}
          {...props}
          variant={variant}
          onClick={() => setShowConfirmation(true)}
          className={cn(className)}
        >
          {label}
        </Button>
      );
    }

    return (
      <div className="flex gap-4 flex-wrap">
        <Button
          type="button"
          ref={ref}
          {...props}
          variant={'destructive'}
          onClick={handleClick}
          className={cn(className)}
        >
          {confirmLabel}
        </Button>
        <Button
          type="button"
          {...props}
          variant={'outline'}
          onClick={() => setShowConfirmation(false)}
          className={cn(className)}
        >
          {cancelLabel}
        </Button>
      </div>
    );
  }
);

ButtonWithConfirmation.displayName = 'ButtonWithConfirmation';
