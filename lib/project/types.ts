import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const MAX_PROJECT_TITLE_LENGTH = 200;
export const MAX_PROJECT_DESCRIPTION_LENGTH = 1000;
export const MAX_PROJECT_TAGS_LENGTH = 30;
export const MAX_PROJECT_LINK_LENGTH = 100;

const posterImageObject = z.object({
  value: z
    .object({
      id: z.string(),
      fileName: z.string(),
      fileType: z.string(),
    })
    .optional(),
});

export const projectFormSchema = (t: ReturnType<typeof useTranslations<'Zod.projectFormSchema'>>) =>
  z.object({
    title: z
      .string()
      .min(1, t('titleRequired'))
      .max(MAX_PROJECT_TITLE_LENGTH, t('titleMaxLen', { maxLen: MAX_PROJECT_TITLE_LENGTH })),
    description: z
      .string()
      .min(1, t('descriptionRequired'))
      .max(MAX_PROJECT_DESCRIPTION_LENGTH, t('descriptionMaxLen', { maxLen: MAX_PROJECT_DESCRIPTION_LENGTH })),
    tags: z.array(
      z.object({
        value: z
          .string()
          .min(1, t('tagRequired'))
          .max(MAX_PROJECT_TAGS_LENGTH, t('tagMaxLen', { maxLen: MAX_PROJECT_TAGS_LENGTH })),
      })
    ),
    exclusiveSupport: z.boolean(),
    hidden: z.boolean(),
    attachments: z.array(
      z.object({
        value: z.object({
          id: z.string(),
          fileName: z.string(),
          fileType: z.string(),
        }),
      })
    ),
    reach: z.coerce.number().min(0, t('expectedReachPositive')),
    budget: z.coerce.number().min(0, t('budgetPositive')),
    posterImage: posterImageObject,
    link: z
      .string()
      .url()
      .max(MAX_PROJECT_LINK_LENGTH, t('linkMaxLen', { maxLen: MAX_PROJECT_LINK_LENGTH }))
      .optional(),
  });

export type ProjectFormValues = z.infer<ReturnType<typeof projectFormSchema>>;
export type PosterImageValues = z.infer<typeof posterImageObject>;
