import { getTranslations } from 'next-intl/server';

export type ServerActionResult<T = never> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const errorResult = async <T = never>(error?: string): Promise<ServerActionResult<T>> => {
  const t = await getTranslations('Action');
  return {
    error: error ?? t('defaultErrorMessage'),
    success: false,
  };
};

export const successResult = <T = never>(data?: T): ServerActionResult<T> => ({ data, success: true });

export type Attachment = {
  value: {
    id: string;
    fileName: string;
    fileType: string;
  };
};

export type AttachmentWithType = {
  value: {
    id: string;
    fileName: string;
    fileType: string;
    attachmentType?: string;
    thumbnailId?: string;
  };
};
