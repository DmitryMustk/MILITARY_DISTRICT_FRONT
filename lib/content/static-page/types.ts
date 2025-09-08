import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { isSlugUnique } from '@/lib/content/static-page/queries';

export const MAX_SLUG_LENGTH = 100;
export const MAX_TITLE_LENGTH = 100;

export const staticPageFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.staticPageFormSchema'>>,
  excludeId?: number
) =>
  z.object({
    slug: z
      .string()
      .min(1, t('slugRequired'))
      .max(MAX_SLUG_LENGTH, t('slugMaxLen', { maxLen: MAX_SLUG_LENGTH }))
      .refine(async (slug) => await isSlugUnique(slug, excludeId), t('slugUnique')),
    title: z
      .string()
      .max(MAX_TITLE_LENGTH, t('titleMaxLen', { maxLen: MAX_TITLE_LENGTH }))
      .optional(),
    order: z.number().int().or(z.string().transform(Number)),
  });

export type StaticPageFormValues = z.infer<ReturnType<typeof staticPageFormSchema>>;
