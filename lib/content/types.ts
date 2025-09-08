import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const newsFormSchema = (t: ReturnType<typeof useTranslations<'Zod.newsFormSchema'>>) =>
  z.object({
    title: z.string().min(1, t('titleRequired')),
    description: z.string().optional(),
    createdAt: z.date({ required_error: t('dateRequired') }).default(() => new Date()),
    mainPictureId: z.string().optional(),
    showAtNewsPage: z.boolean(),
    showAtHomePage: z.boolean(),
  });

export type NewsFormValues = z.infer<ReturnType<typeof newsFormSchema>>;
