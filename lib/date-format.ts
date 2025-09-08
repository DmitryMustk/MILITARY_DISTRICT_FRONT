import { format, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function formatDate(date: Date) {
  const now = new Date();

  if (format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')) {
    return 'Today';
  }

  // If the date is in the same year, show the date without the year (e.g., "January 15")
  if (format(date, 'yyyy') === format(now, 'yyyy')) {
    return format(date, 'MMMM d', { locale: enUS });
  }

  // Otherwise, show the full date (e.g., "January 15, 2024")
  return format(date, 'MMMM d, yyyy', { locale: enUS });
}

/**
 * Formats the Date to yyyy-MM-dd format according to the date`s timezone
 */
export function toNormalizedDateString(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Extracts Date from the string in yyyy-MM-dd format in the user`s timezone
 */
export function fromNormalizedDateString(string: string) {
  const [year, month, day] = string.split(`-`);

  const date = startOfDay(new Date());
  date.setFullYear(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, Number.parseInt(day, 10));
  return date;
}

export const isDayPassed = (date: Date) => date < startOfDay(new Date());

export const addUntilDayEnd = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59));
};

export const getLastWeekDate = () => {
  const res = new Date();

  res.setMinutes(res.getMinutes() - parseInt(process.env.ARTIST_SUBMITTED_APPLICATION_DURATION_UNTIL_WEEK_IN_MINUTES!));

  return res;
};

export const getLastMonthDate = () => {
  const res = new Date();

  res.setMinutes(
    res.getMinutes() - parseInt(process.env.ARTIST_SUBMITTED_APPLICATION_DURATION_UNTIL_MONTH_IN_MINUTES!)
  );

  return res;
};

export const getLastYearDate = () => {
  const res = new Date();

  res.setMinutes(res.getMinutes() - parseInt(process.env.ARTIST_SUBMITTED_APPLICATION_DURATION_UNTIL_YEAR_IN_MINUTES!));

  return res;
};
