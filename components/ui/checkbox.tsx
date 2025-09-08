'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Circle } from 'lucide-react';
import Check from '@/public/images/check.svg';

import { cn } from '@/lib/utils';

interface CheckboxProps {
  variant?: 'rounded' | 'circle';
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & CheckboxProps
>(({ className, ...props }, ref) => {
  const variant = props.variant ? props.variant : 'rounded';
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 data-[state=unchecked]:border border-gray-30 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        {
          'rounded-xxs': variant === 'rounded',
          'rounded-full': variant === 'circle',
        },
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        {variant === 'rounded' && <Check />}
        {variant === 'circle' && <Circle className="h-[6px] w-[6px] fill-primary-foreground" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
