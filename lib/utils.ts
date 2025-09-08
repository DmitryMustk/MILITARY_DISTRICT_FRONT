import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Option } from '@/components/ui/multi-select';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const phoneNumberPattern = new RegExp(/^\s*$|^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

export const getPreviousPath = (pathWhiteList: string[], referer?: string | null) => {
  const prevUrl = referer ? new URL(referer) : undefined;
  const prevPath = prevUrl ? `${prevUrl.pathname}${prevUrl.search}` : undefined;
  return prevPath &&
    pathWhiteList.some((path: string) => new RegExp(path.replace(/\?/g, '\\?') + '(\\?(.*))?$').test(prevPath))
    ? prevPath
    : undefined;
};

export const getSelectOptionsFromEnum = (options: object): Option[] => {
  return Object.values(options).map((option: string) => ({ value: option, label: option }));
};

export const getSelectOptionsFromEnumTranslated = <T extends object>(
  options: T,
  t: (key: keyof T) => string
): Option[] => {
  if (!options) {
    return [];
  }
  return Object.keys(options).map((option) => ({ value: option, label: t(option as keyof T) }));
};

export const toOptions = <T>(value: T) => ({ value });

export const fromOptions = <T>({ value }: { value: T }) => value;

export const decodeURIArrayParam = (param?: string) => {
  return param ? decodeURIComponent(param).split(',') : undefined;
};

export const getURIArrayParam = (param: string | null) => {
  if (!param) {
    return [];
  }

  const params = decodeURIComponent(param).split(',');
  return params.map((p) => ({ value: p, label: p }));
};

export const getURINumberParam = (param: string | undefined) => {
  return param ? parseInt(param) : undefined;
};

export const imageExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];

export const isAttachmentImage = (fileType: string) => imageExtension.includes(fileType);
