import { useTranslations } from 'next-intl';
import { z } from 'zod';

const MAX_ATTACHMENT_TYPE_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 2000;

export const opportunityApplicationFormSchema = (
  t: ReturnType<typeof useTranslations<'Zod.opportunityApplicationFormSchema'>>
) =>
  z.object({
    message: z
      .string()
      .min(1, t('messageRequired'))
      .max(MAX_MESSAGE_LENGTH, t('messageMaxLen', { maxLen: MAX_MESSAGE_LENGTH })),
    projectId: z.string().optional(),
    attachments: z.array(
      z.object({
        value: z
          .object({
            id: z.string(),
            fileName: z.string(),
            fileType: z.string(),
            attachmentType: z.string().optional(),
          })
          .refine((data) => !data.attachmentType || data.attachmentType.length <= MAX_ATTACHMENT_TYPE_LENGTH, {
            message: t('attachmentTypeMaxLen', { maxLen: MAX_ATTACHMENT_TYPE_LENGTH }),
          }),
      })
    ),
  });

export type OpportunityApplicationFormValues = z.infer<ReturnType<typeof opportunityApplicationFormSchema>>;
