import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { $Enums } from '@prisma/client';
import { isEmailRegistered } from '@/lib/user/queries';

const MAX_ORGANIZATION_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MAX_MESSAGE_SUBJECT_LEN = 255;
const MAX_MESSAGE_PROVIDER_LENGTH = 512;

export const userInvitationFormSchema = (t: ReturnType<typeof useTranslations<'Zod.userInvitationFormSchema'>>) =>
  z
    .object({
      organizationName: z
        .string()
        .min(1, t('organizationNameRequired'))
        .max(MAX_ORGANIZATION_NAME_LENGTH, t('organizationNameMaxLen', { maxLen: MAX_ORGANIZATION_NAME_LENGTH })),
      email: z
        .string()
        .email(t('emailInvalid'))
        .min(1, t('emailRequired'))
        .max(MAX_EMAIL_LENGTH, t('emailMaxLen', { maxLen: MAX_EMAIL_LENGTH })),
      messageSubject: z
        .string()
        .max(MAX_MESSAGE_SUBJECT_LEN, t('messageSubjectMaxLen', { maxLen: MAX_MESSAGE_SUBJECT_LEN }))
        .optional(),
      message: z
        .string()
        .max(MAX_MESSAGE_PROVIDER_LENGTH, t('messageMaxLen', { maxLen: MAX_MESSAGE_PROVIDER_LENGTH }))
        .optional(),
      roles: z.array(
        z.object({
          value: z.nativeEnum($Enums.Role),
        })
      ),
    })
    .refine((data) => data.roles.length > 0, {
      message: t('rolesRequired'),
      path: ['roles'],
    })
    .refine(
      (data) => {
        return !(data.roles.length > 1 && !data.messageSubject);
      },
      {
        message: t('messageSubjectRequiredIfMultipleRoles'),
        path: ['messageSubject'],
      }
    )
    .refine(
      (data) => {
        return !(data.roles.length > 1 && !data.message);
      },
      {
        message: t('messageRequiredIfMultipleRoles'),
        path: ['message'],
      }
    )
    .superRefine(async (data, ctx) => {
      const isRegistered = await isEmailRegistered(data.email);
      if (isRegistered) {
        ctx.addIssue({
          code: 'custom',
          message: t('emailBusy'),
          path: ['email'],
        });
      }
    });

export type UserInvitationFormValues = z.infer<ReturnType<typeof userInvitationFormSchema>>;
