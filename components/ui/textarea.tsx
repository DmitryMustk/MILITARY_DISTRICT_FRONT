import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'> & { error?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full border border-input bg-transparent px-4 py-3.5 text-base leading-[18px] shadow-sm placeholder:text-neutral-gray disabled:cursor-not-allowed disabled:border-neutral-gray disabled:text-neutral-gray',
          {
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring': props.error !== 'true',
            'border-destructive': props.error === 'true',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
