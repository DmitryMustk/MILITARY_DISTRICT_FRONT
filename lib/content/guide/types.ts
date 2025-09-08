import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { $Enums } from '@prisma/client';
import ResourceType = $Enums.ResourceType;

export const MAX_GUIDE_TITLE_LENGTH = 255;

const guideFileObject = z.object({
  value: z
    .object({
      id: z.string(),
      fileName: z.string(),
      fileType: z.string(),
    })
    .nullable(),
});

export const guideFormSchema = (t: ReturnType<typeof useTranslations<'Zod.guideFormSchema'>>) =>
  z
    .object({
      title: z
        .string()
        .min(1, t('titleRequired'))
        .max(MAX_GUIDE_TITLE_LENGTH, t('titleMaxLen', { maxLen: MAX_GUIDE_TITLE_LENGTH })),
      resourceType: z.nativeEnum($Enums.ResourceType),
      order: z.number().int().or(z.string().transform(Number)),
      file: guideFileObject.optional(),
      link: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.resourceType == ResourceType.FILE && !data.file?.value) {
        ctx.addIssue({
          code: 'custom',
          message: t('fileRequired'),
          path: ['file'],
        });
      }
      if (data.resourceType == ResourceType.LINK && !data.link) {
        ctx.addIssue({
          code: 'custom',
          message: t('linkRequired'),
          path: ['link'],
        });
      }
    });

export type GuideFormValues = z.infer<ReturnType<typeof guideFormSchema>>;
