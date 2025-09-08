'use client';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-format';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useTranslations } from 'next-intl';
import { Matcher } from 'react-day-picker';

interface CalendarButtonProps {
  placeholder?: string;
  disabledDates?: Matcher | Matcher[];
  required?: boolean;

  date: Date | null;
  onSelect: (value: Date | null) => void;
}

export function CalendarButton({ placeholder, disabledDates, date, onSelect, required }: CalendarButtonProps) {
  const t = useTranslations('Component.CalendarButton');

  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);

  const handleSelect = useCallback(
    (value: Date | undefined) => {
      setIsOpen(false);
      onSelect(value ?? null);
    },
    [onSelect]
  );

  const clearDate = useCallback(() => {
    setIsOpen(false);
    onSelect(null);
  }, [onSelect]);

  return (
    <>
      <Button
        type={'button'}
        onClick={open}
        variant={'outline'}
        className={cn('min-h-[52px] !rounded-none pl-3 text-left font-normal', !date && 'text-muted-foreground')}
      >
        {date ? formatDate(date) : <span>{placeholder ?? t(`defaultPlaceholder`)}</span>}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
      {/* This is a fix for dialog flickering */}
      {/* In some cases, when the dialog closes in the same time search params are being changed, it might flicker */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-80 items-center flex flex-col" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>{t('dialogTitle')}</DialogTitle>
            </DialogHeader>
            <Calendar
              className={'w-64'}
              mode="single"
              selected={date || undefined}
              onSelect={handleSelect}
              disabled={disabledDates}
              autoFocus
            />
            <div className="flex gap-2">
              {!required && <Button onClick={clearDate}>{t('clearButton')}</Button>}
              <DialogClose asChild>
                <Button variant="outline">{t('closeButton')}</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
