'use client';

import { add, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatDateLocal(date: Date) {
  const now = new Date();
  const dateUTC = add(date, { minutes: date.getTimezoneOffset() });

  if (format(dateUTC, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
    return 'Today';
  }

  // If the date is in the same year, show the date without the year (e.g., "January 15")
  if (format(dateUTC, 'yyyy') === format(now, 'yyyy')) {
    return format(dateUTC, 'MMMM d', { locale: enUS });
  }

  // Otherwise, show the full date (e.g., "January 15, 2024")
  return format(dateUTC, 'MMMM d, yyyy', { locale: enUS });
}
