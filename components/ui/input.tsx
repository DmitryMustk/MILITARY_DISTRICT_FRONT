import * as React from 'react';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import CloseIcon from '../../public/images/close.svg';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { error?: string; onClear?: () => void }
>(({ className, type, onClear, ...props }, ref) => {
  return (
    <div
      className={cn(
        'flex border border-input shadow-sm',
        {
          'border-destructive': props.error === 'true',
          'focus-within:ring-1 focus-within:ring-ring': props.error !== 'true',
        },
        type === 'search' ? className : ''
      )}
    >
      <input
        type={type}
        className={cn(
          'flex  min-h-[52px] items-center w-full bg-transparent px-4 py-3.5 text-base leading-[18px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-gray focus-visible:outline-none disabled:cursor-not-allowed disabled:border-neutral-gray disabled:text-neutral-gray',
          type !== 'search' ? className : ''
        )}
        ref={ref}
        {...props}
      />
      {type === 'search' && (
        <div className="flex justify-start items-center w-[2.25rem]">
          <Search strokeWidth={1.5} className="h-[1.125rem] w-[1.125rem]" />
        </div>
      )}
      {!!onClear && (
        <div className="flex justify-start items-center w-[2.25rem] cursor-pointer">
          <CloseIcon className="h-6 w-6" onClick={onClear} />
        </div>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
